import React from "react";
import { ReactFlowProvider } from "reactflow";
import { Toaster } from "./components/ui/Toaster";
import FlowchartEditor from "./components/FlowchartEditor";
import AppHeader from "./components/AppHeader";
import { FlowchartProvider } from "./contexts/FlowchartContext";

function App() {
  <FlowchartProvider>
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <AppHeader />
      <main className="flex-1 overflow-hidden">
        <ReactFlowProvider>
          <FlowchartEditor />
        </ReactFlowProvider>
      </main>
      <Toaster />
    </div>
  </FlowchartProvider>;
}

export default App;
