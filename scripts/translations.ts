import fs from "fs/promises";
import path from "path";

import crowdin, {
  Credentials,
  TranslationStatus,
} from "@crowdin/crowdin-api-client";

const token = process.env.TOKEN || "";

(async () => {
  const credentials: Credentials = {
    token,
  };
  const { projectsGroupsApi } = new crowdin(credentials);
  const t = await projectsGroupsApi.listProjects();
  const api: TranslationStatus = new TranslationStatus(credentials);
  const progress = await api.getProjectProgress(302994, { limit: 100 });
  const final = progress.data.reduce((acc, item) => {
    const { languageId, translationProgress, approvalProgress } = item.data;
    // @ts-ignore
    acc[languageId] = { translationProgress, approvalProgress };
    return acc;
  }, {});

  fs.writeFile(
    path.join(__dirname, "./progress_lang.json"),
    JSON.stringify(final, null, 4)
  );
})();
