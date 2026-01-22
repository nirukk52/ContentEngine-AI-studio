import { gapi } from 'gapi-script';
import { v4 as uuidv4 } from 'uuid';
import { Project, UserSettings, FeedbackItem } from '../types';

// Constants
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// -- Types matching User Requirements --

export interface StoredProjectIndexEntry {
  projectId: string;
  name: string;
  updatedAt: string; // ISO date
  folderId: string;
}

export interface StoredIndex {
  projects: StoredProjectIndexEntry[];
  settings?: UserSettings; // Global settings stored here for simplicity
  lastSync?: string;
}

export interface ProjectMetadata {
  id: string;
  title: string;
  topic: string;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
}

// In-Memory Cache
let cachedIndex: StoredIndex | null = null;
let rootFolderId: string | null = null;
let currentUserSub: string | null = null;

// -- GAPI Initialization --

export const initDriveAPI = async (accessToken: string) => {
  if (!gapi.client) {
    await new Promise<void>((resolve, reject) => {
      gapi.load('client', resolve);
    });
  }

  // Initialize client if not already (or just set token)
  // Note: in a React functional flow with @react-oauth, we mostly just need to set the token 
  // for gapi.client to work, provided we loaded the discovery docs.

  await gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
  });

  gapi.client.setToken({ access_token: accessToken });
};

// -- Core Drive Operations --

const findFolder = async (name: string, parentId: string = 'root') => {
  const query = `mimeType='application/vnd.google-apps.folder' and name='${name}' and '${parentId}' in parents and trashed=false`;
  const response = await gapi.client.drive.files.list({
    q: query,
    fields: 'files(id, name)',
    spaces: 'drive'
  });
  return response.result.files?.[0] || null;
};

const createFolder = async (name: string, parentId: string = 'root') => {
  const fileMetadata = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentId]
  };
  const response = await gapi.client.drive.files.create({
    resource: fileMetadata,
    fields: 'id'
  } as any);
  return response.result.id;
};

const findFile = async (name: string, parentId: string) => {
  const query = `name='${name}' and '${parentId}' in parents and trashed=false`;
  const response = await gapi.client.drive.files.list({
    q: query,
    fields: 'files(id, name)',
  });
  return response.result.files?.[0] || null;
};

const downloadJson = async (fileId: string) => {
  const response = await gapi.client.drive.files.get({
    fileId: fileId,
    alt: 'media'
  });
  return response.result; // This usually returns the parsed JSON body if content-type is json
};

const uploadJson = async (name: string, content: any, parentId: string, existingFileId?: string) => {
  const file = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
  const metadata = {
    name,
    mimeType: 'application/json',
    parents: existingFileId ? undefined : [parentId]
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const accessToken = gapi.auth.getToken().access_token;

  const method = existingFileId ? 'PATCH' : 'POST';
  const url = existingFileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart`
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

  const response = await fetch(url, {
    method,
    headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
    body: form
  });

  return await response.json();
};

const uploadFile = async (name: string, blob: Blob, parentId: string, mimeType: string) => {
  const metadata = {
    name,
    mimeType, // e.g. 'image/png'
    parents: [parentId]
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', blob);

  const accessToken = gapi.auth.getToken().access_token;

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webContentLink,webViewLink', {
    method: 'POST',
    headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
    body: form
  });

  return await response.json();
};

export const ensureRootFolder = async (userIdSub: string) => {
  currentUserSub = userIdSub;
  const folderName = `contentengine-data-${userIdSub}`;

  let folder = await findFolder(folderName);
  if (!folder) {
    const id = await createFolder(folderName);
    rootFolderId = id;
  } else {
    rootFolderId = folder.id!;
  }
  return rootFolderId;
};

// -- Project System Implementation --

export const loadIndex = async (): Promise<StoredIndex> => {
  if (!rootFolderId) throw new Error("Root folder not initialized");

  const file = await findFile('index.json', rootFolderId);
  if (!file) {
    // Create empty index
    const newIndex: StoredIndex = { projects: [], serverTimestamp: new Date().toISOString() } as any;
    await uploadJson('index.json', newIndex, rootFolderId);
    cachedIndex = newIndex;
    return newIndex;
  }

  const content = await downloadJson(file.id!);
  cachedIndex = content as StoredIndex;
  return cachedIndex;
};

export const saveProject = async (project: Project, createVersion: boolean = false) => {
  if (!rootFolderId) throw new Error("Root folder not initialized");
  if (!cachedIndex) await loadIndex();

  const shortSlug = project.title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10) || 'untitled';
  const folderName = `proj_${project.id}_${shortSlug}`;

  // 1. Find or Create Project Folder
  let projectFolderId: string;
  let indexEntry = cachedIndex!.projects.find(p => p.projectId === project.id);

  if (indexEntry) {
    projectFolderId = indexEntry.folderId;
  } else {
    // Try to find it by name just in case index is stale, otherwise create
    const existingFolder = await findFolder(folderName, rootFolderId);
    if (existingFolder) {
      projectFolderId = existingFolder.id!;
    } else {
      projectFolderId = await createFolder(folderName, rootFolderId);
      // Create subfolders
      await createFolder('versions', projectFolderId);
      await createFolder('assets', projectFolderId);
    }
  }

  // 2. Save project.json (Mutable Source of Truth)
  const existingProjectFile = await findFile('project.json', projectFolderId);
  await uploadJson('project.json', project, projectFolderId, existingProjectFile?.id);

  // 3. Create Version if requested (Immutable)
  if (createVersion) {
    const versionsFolder = await findFolder('versions', projectFolderId);
    if (versionsFolder) {
      const versionCount = (await gapi.client.drive.files.list({
        q: `'${versionsFolder.id}' in parents and trashed=false`,
        fields: 'files(id)'
      })).result.files?.length || 0;

      const vName = `v${(versionCount + 1).toString().padStart(4, '0')}.json`;
      await uploadJson(vName, project, versionsFolder.id!);
    }
  }

  // 4. Update Index
  const now = new Date().toISOString();
  const newEntry: StoredProjectIndexEntry = {
    projectId: project.id,
    name: project.title,
    updatedAt: now,
    folderId: projectFolderId
  };

  if (indexEntry) {
    Object.assign(indexEntry, newEntry);
  } else {
    cachedIndex!.projects.push(newEntry);
  }

  // Save Index
  const existingIndexFile = await findFile('index.json', rootFolderId);
  await uploadJson('index.json', cachedIndex, rootFolderId, existingIndexFile?.id);

  return project;
};

export const loadProject = async (projectId: string): Promise<Project | null> => {
  if (!cachedIndex) await loadIndex();

  const entry = cachedIndex!.projects.find(p => p.projectId === projectId);
  if (!entry) return null;

  const file = await findFile('project.json', entry.folderId);
  if (!file) return null;

  const data = await downloadJson(file.id!);
  // Revive dates
  if (data.createdAt) data.createdAt = new Date(data.createdAt);

  return data as Project;
};

export const saveSettings = async (settings: UserSettings) => {
  if (!rootFolderId) throw new Error("Root folder not initialized");
  if (!cachedIndex) await loadIndex();

  cachedIndex!.settings = settings;
  const existingIndexFile = await findFile('index.json', rootFolderId);
  await uploadJson('index.json', cachedIndex, rootFolderId, existingIndexFile?.id);
};

export const getSettings = (): UserSettings | undefined => {
  return cachedIndex?.settings;
};

export const uploadAsset = async (projectId: string, blob: Blob, filename: string): Promise<string> => {
  if (!rootFolderId) throw new Error("Root folder not initialized");
  if (!cachedIndex) await loadIndex();

  const entry = cachedIndex!.projects.find(p => p.projectId === projectId);
  if (!entry) throw new Error("Project not found in index");

  // Find assets folder
  let assetsFolder = await findFolder('assets', entry.folderId);
  if (!assetsFolder) {
    const id = await createFolder('assets', entry.folderId);
    assetsFolder = { id, name: 'assets' };
  }

  const mimeType = blob.type || 'application/octet-stream';
  const result = await uploadFile(filename, blob, assetsFolder.id || (assetsFolder as any), mimeType);

  return `drive://${result.id}`;
};

export const resolveAssetUrl = async (url: string): Promise<string> => {
  if (!url.startsWith('drive://')) return url;
  const fileId = url.replace('drive://', '');

  try {
    const accessToken = gapi.auth.getToken().access_token;
    const fetchRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const blob = await fetchRes.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error("Failed to resolve asset", e);
    return url;
  }
};