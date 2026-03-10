import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { taskAPI } from '../../../services/api';

export const TaskFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditing = Boolean(id);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      status: 'pending' as 'pending' | 'completed',
    },
   
    validationSchema: Yup.object({
      title: Yup.string()
        .min(5, 'Task name must have at least 5 characters')
        .required('Please enter a task name'),
      description: Yup.string()
        .min(10, 'Description must have at least 10 characters')
        .required('Please enter a description'),
      status: Yup.string().required('Please select a status'),
    }),
    onSubmit: async (values) => {
      try {
        if (isEditing && id) {
          await taskAPI.updateTask(id, values);
          alert('Update successful!');
        } else {
          await taskAPI.createTask(values);
          alert('New task created successfully!');
        }
        navigate('/tasks'); 
      } catch (error) {
        console.error('Error saving data:', error);
        alert('Failed to save data, please try again');
      }
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      const fetchTask = async () => {
        try {
          const taskData = await taskAPI.getTaskById(id);
          formik.setValues({
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
          });
        } catch (error) {
          console.error('Failed to fetch task data:', error);
        }
      };
      fetchTask();
    }
  }, [id, isEditing]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start pt-20">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditing ? 'แก้ไข Task' : 'สร้าง Task ใหม่'}
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          
          {/* ช่องกรอกชื่อ Task */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Name</label>
            <input
              type="text"
              {...formik.getFieldProps('title')}
              className={`mt-1 block w-full rounded-md border p-3 focus:ring-2 outline-none
                ${formik.touched.title && formik.errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              placeholder="e.g. Learn about Vite.js"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.title}</p>
            )}
          </div>

          {/* ช่องกรอกรายละเอียด */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              {...formik.getFieldProps('description')}
              className={`mt-1 block w-full rounded-md border p-3 focus:ring-2 outline-none
                ${formik.touched.description && formik.errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              placeholder="Enter task details..."
            />
            {formik.touched.description && formik.errors.description && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.description}</p>
            )}
          </div>

          {/* Dropdown เลือกสถานะ */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              {...formik.getFieldProps('status')}
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* ปุ่มกดยืนยัน และ ยกเลิก */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
          
              disabled={!formik.isValid || !formik.dirty}
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};