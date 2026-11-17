/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { SchemesPage } from './pages/SchemesPage';
import { SchemeDetailPage } from './pages/SchemeDetailPage';
import { EligibilityPage } from './pages/EligibilityPage';
import { AgriculturePage } from './pages/AgriculturePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          <Route
            path="/schemes"
            element={
              <MainLayout>
                <SchemesPage />
              </MainLayout>
            }
          />
          <Route
            path="/schemes/:slug"
            element={
              <MainLayout>
                <SchemeDetailPage />
              </MainLayout>
            }
          />
          <Route
            path="/eligibility"
            element={
              <MainLayout>
                <EligibilityPage />
              </MainLayout>
            }
          />
          <Route
            path="/agriculture/:section"
            element={
              <MainLayout>
                <AgriculturePage />
              </MainLayout>
            }
          />
          <Route
            path="/agriculture"
            element={
              <MainLayout>
                <AgriculturePage />
              </MainLayout>
            }
          />
          <Route
            path="/login"
            element={
              <MainLayout>
                <LoginPage />
              </MainLayout>
            }
          />
          <Route
            path="/register"
            element={
              <MainLayout>
                <RegisterPage />
              </MainLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            }
          />
          <Route
            path="/admin"
            element={
              <MainLayout>
                <AdminDashboardPage />
              </MainLayout>
            }
          />
          <Route
            path="/chatbot"
            element={
              <MainLayout hideFloatingChat>
                <ChatbotPage />
              </MainLayout>
            }
          />
          <Route
            path="/about"
            element={
              <MainLayout>
                <AboutPage />
              </MainLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <MainLayout>
                <ContactPage />
              </MainLayout>
            }
          />
          <Route
            path="*"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
