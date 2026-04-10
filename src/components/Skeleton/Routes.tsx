import { Route, Routes } from "react-router-dom";

import HomePage from "../../pages/Home";
import MeetingPage from "../../pages/Meeting";
import MyPage from "../../pages/My";
import RecordPage from "../../pages/Record";
import RunningPage from "../../pages/Running";
import type { RunDraft, RunRecord } from "../../types/run";

type RunningView = "ready" | "active" | "summary";

interface AppRoutesProps {
  averagePaceSeconds: number | null;
  distanceMeters: number;
  draft: RunDraft;
  elapsedMs: number;
  latestSummary: RunRecord | null;
  notice: string;
  onBackHome: () => void;
  onFinishRun: () => void;
  onLogout: () => void | Promise<void>;
  onOpenRecords: () => void;
  onOpenRunning: () => void;
  onPauseRun: () => void;
  onResumeRun: () => void;
  onStartRun: () => void;
  onViewChange: (view: RunningView) => void;
  records: RunRecord[];
  runningView: RunningView;
  todayRecordCount: number;
  userEmail: string;
  userNickname: string;
}

export default function AppRoutes(props: AppRoutesProps) {
  const routeProps = [
    {
      element: (
        <HomePage
          records={props.records}
          todayRecordCount={props.todayRecordCount}
          onOpenRecords={props.onOpenRecords}
          onOpenRunning={props.onOpenRunning}
        />
      ),
      path: ["/", "/home"],
    },
    {
      element: (
        <RunningPage
          averagePaceSeconds={props.averagePaceSeconds}
          distanceMeters={props.distanceMeters}
          draft={props.draft}
          elapsedMs={props.elapsedMs}
          latestSummary={props.latestSummary}
          notice={props.notice}
          onBack={props.onBackHome}
          onFinish={props.onFinishRun}
          onPause={props.onPauseRun}
          onResume={props.onResumeRun}
          onStart={props.onStartRun}
          onViewChange={props.onViewChange}
          runningView={props.runningView}
        />
      ),
      path: "/running",
    },
    {
      element: <RecordPage records={props.records} onBack={props.onBackHome} />,
      path: "/record",
    },
    {
      element: <MeetingPage onBack={props.onBackHome} />,
      path: "/meeting",
    },
    {
      element: (
        <MyPage
          email={props.userEmail}
          nickname={props.userNickname}
          onBack={props.onBackHome}
          onLogout={props.onLogout}
          recordCount={props.records.length}
        />
      ),
      path: "/my",
    },
  ];

  return (
    <Routes>
      {routeProps.map((route) => {
        if (Array.isArray(route.path)) {
          return route.path.map((path) => (
            <Route element={route.element} key={path} path={path} />
          ));
        }

        return <Route element={route.element} key={route.path} path={route.path} />;
      })}
      <Route element={<HomePage records={props.records} todayRecordCount={props.todayRecordCount} onOpenRecords={props.onOpenRecords} onOpenRunning={props.onOpenRunning} />} path="*" />
    </Routes>
  );
}
