// Custom hook to use the file system context
import {useContext} from "react";
import FileSystemContext from "./FileSystemContext.jsx";

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};