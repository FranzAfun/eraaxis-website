/**
 * Choosing files from Google Drive on a form's file question, instead of from
 * the device. Google's own picker opens; the person signs in to Google and
 * picks; the files come down to the browser and go up like any other, under the
 * same checks. Google Docs, Sheets and Slides come as PDF or Excel.
 *
 * Only with VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_API_KEY and VITE_GOOGLE_APP_ID
 * set (the same Google project as EDOS; see EDOS's DEPLOYMENT.md); without them
 * nothing offers Google Drive. The access asked for is "drive.file": only the
 * files the person picks. Kept in step with EDOS's src/shared/utils/googleDrive.js.
 */

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "";
const APP_ID = import.meta.env.VITE_GOOGLE_APP_ID || "";
const SCOPE = "https://www.googleapis.com/auth/drive.file";

export const driveAvailable = Boolean(CLIENT_ID && API_KEY && APP_ID);

// Google's own formats, as the file a person would download from Drive.
const EXPORTS = {
  "application/vnd.google-apps.document": ["application/pdf", ".pdf"],
  "application/vnd.google-apps.presentation": ["application/pdf", ".pdf"],
  "application/vnd.google-apps.drawing": ["application/pdf", ".pdf"],
  "application/vnd.google-apps.spreadsheet": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx"],
};

const loaded = new Map();
function loadScript(src) {
  if (!loaded.has(src)) {
    loaded.set(src, new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => { loaded.delete(src); reject(new Error("Google Drive could not be reached. Check your connection.")); };
      document.head.appendChild(script);
    }));
  }
  return loaded.get(src);
}

async function ready() {
  await Promise.all([loadScript("https://apis.google.com/js/api.js"), loadScript("https://accounts.google.com/gsi/client")]);
  await new Promise((resolve) => window.gapi.load("picker", resolve));
}

// One sign-in per visit; Google asks again only when it has run out.
let session = { token: null, until: 0 };
function accessToken() {
  if (session.token && Date.now() < session.until) return Promise.resolve(session.token);
  return new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (reply) => {
        if (reply.error) return reject(new Error("Google Drive was not opened."));
        session = { token: reply.access_token, until: Date.now() + (Number(reply.expires_in || 3600) - 60) * 1000 };
        return resolve(reply.access_token);
      },
      error_callback: () => reject(new Error("Google Drive was not opened.")),
    });
    client.requestAccessToken({ prompt: "" });
  });
}

async function download(doc, token) {
  const exported = EXPORTS[doc.mimeType];
  const base = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(doc.id)}`;
  const url = exported ? `${base}/export?mimeType=${encodeURIComponent(exported[0])}` : `${base}?alt=media`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`"${doc.name}" could not be brought from Google Drive.`);
  const blob = await response.blob();
  const name = exported && !doc.name.toLowerCase().endsWith(exported[1]) ? `${doc.name}${exported[1]}` : doc.name;
  return new File([blob], name, { type: exported ? exported[0] : (doc.mimeType || blob.type), lastModified: Date.now() });
}

/** Opens Google's picker; resolves with the chosen files (none if closed). */
export async function pickFromDrive({ multiple = false } = {}) {
  if (!driveAvailable) return [];
  await ready();
  const token = await accessToken();
  const { picker } = window.google;
  return new Promise((resolve, reject) => {
    const view = new picker.DocsView(picker.ViewId.DOCS).setIncludeFolders(true).setSelectFolderEnabled(false);
    const builder = new picker.PickerBuilder()
      .setAppId(APP_ID)
      .setOAuthToken(token)
      .setDeveloperKey(API_KEY)
      .addView(view)
      .setCallback(async (data) => {
        if (data.action === picker.Action.CANCEL) return resolve([]);
        if (data.action !== picker.Action.PICKED) return undefined;
        try {
          return resolve(await Promise.all((data.docs || []).map((doc) => download(doc, token))));
        } catch (error) {
          return reject(error);
        }
      });
    if (multiple) builder.enableFeature(picker.Feature.MULTISELECT_ENABLED);
    builder.build().setVisible(true);
  });
}
