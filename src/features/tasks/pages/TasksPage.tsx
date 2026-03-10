import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI, type Task } from '../../../services/api';

export const TasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await taskAPI.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Fetch data not successful:", error);
      alert("Cant load data, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      try {
        await taskAPI.deleteTask(id);
        fetchTasks();
      } catch (error) {
        console.error("Delete data not successful:", error);
        alert("An error occurred while deleting the data, please try again");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        
        {/* ส่วนหัวของหน้า (Header) */}
        <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-md">
          <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
          <div className="space-x-4">

            {/* เติม onClick ให้ปุ่มสร้าง Task ใหม่ */}
            <button 
              onClick={() => navigate('/tasks/new')}
              className="rounded bg-green-500 px-4 py-2 font-semibold text-white transition hover:bg-green-600"
            >
              Create New Task
            </button>
            <button 
              onClick={handleLogout}
              className="rounded bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ส่วนแสดงรายการ Task */}
        {isLoading ? (
          <div className="text-center text-xl font-semibold text-gray-600">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-xl font-semibold text-gray-600">Not have Task</div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center">
                
                {/* ข้อมูล Task */}
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                  <p className="mt-1 text-gray-600">{task.description}</p>
                  
                  {/* ป้ายกำกับสถานะ (Badge) */}
                  <span className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold 
                    ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {task.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>

                {/* ปุ่มจัดการแก้ไข/ลบ */}
                <div className="flex space-x-3">

                  {/* เติม onClick ให้ปุ่มแก้ไข และแนบ id ไปด้วย */}
                  <button 
                    onClick={() => navigate(`/tasks/edit/${task.id}`)}
                    className="rounded bg-blue-100 px-4 py-2 font-medium text-blue-700 transition hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="rounded bg-red-100 px-4 py-2 font-medium text-red-700 transition hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};