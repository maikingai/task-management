import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const LoginPage = () => {
  const navigate = useNavigate();
  
  const [apiError, setApiError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email format (e.g. user@example.com)')
        .required('Please enter email'),
      password: Yup.string()
        .min(6, 'Password must have at least 6 characters')
        .required('Please enter password'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiError('');

      try {
        const response = await axios.post(`api/auth/login`, {
          email: values.email,
          password: values.password,
        });

        const token = response.data.access_token;
        console.log('Received Token:', token); 
          localStorage.setItem('token', token);
          alert('Login successful!');
          navigate('/tasks');

      } catch (error) {
        console.error('Login Error:', error); 
        const errorMessage =  'Login failed, please try again';
        setApiError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
          Login
        </h2>

        {/* Show error message from API (if any) */}
        {apiError && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {apiError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Email input field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...formik.getFieldProps('email')}
              className={`mt-1 block w-full rounded-md border p-3 outline-none focus:ring-2 
                ${formik.touched.email && formik.errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'}`}
              placeholder="admin@nodesnow.com"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="mt-1 text-sm text-red-500">{formik.errors.email}</div>
            )}
          </div>

          {/* Password input field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...formik.getFieldProps('password')}
              className={`mt-1 block w-full rounded-md border p-3 outline-none focus:ring-2 
                ${formik.touched.password && formik.errors.password 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'}`}
              placeholder="••••••••"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="mt-1 text-sm text-red-500">{formik.errors.password}</div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
            className="w-full rounded-md bg-blue-600 py-3 text-white font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 flex justify-center items-center"
          >
            {formik.isSubmitting ? 'Checking...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};