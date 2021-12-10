import useTaskMutations from "./useTaskMutations";
import { useAllTasksInProject } from "./useTaskQueries";

const useTasks = (project) => {
  const { tasks, loading } = useAllTasksInProject(project);
  const { addTask, updateTask, deleteTask } = useTaskMutations(project);
  return {
    loading,
    tasks,
    updateTask,
    addTask,
    deleteTask,
  };
};
export default useTasks;
