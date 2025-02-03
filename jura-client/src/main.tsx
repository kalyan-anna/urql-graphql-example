import "normalize.css";
import "./index.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { ThemeProvider } from "@material-tailwind/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "urql";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { ActiveSprintPage } from "./pages/ActiveSprintPage.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";
import { IndexPage } from "./pages/IndexPage.tsx";
import { IssuesPage } from "./pages/IssuesPage.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { ProfilePage } from "./pages/ProfilePage.tsx";
import { ProjectPage } from "./pages/ProjectPage.tsx";
import { client } from "./utils/client.helper.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider value={client}>
      <BrowserRouter>
        <ErrorBoundary>
          <ThemeProvider>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/project/:projectId" element={<ProjectPage />}>
                <Route index element={<Navigate to="issues" replace />} />
                <Route path="issues" element={<IssuesPage />} />
                <Route path="active" element={<ActiveSprintPage />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
