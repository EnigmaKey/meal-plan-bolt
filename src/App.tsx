import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { ChefHat, UserCircle } from 'lucide-react';
import { SearchView } from './components/SearchView';
import { AddRecipeView } from './components/AddRecipeView';
import { RecipesView } from './components/RecipesView';
import { MealPlanView } from './components/MealPlanView';
import { GroceryListView } from './components/GroceryListView';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/AuthModal';

function AppContent() {
  const [activeTab, setActiveTab] = useState('search');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Grocer</h1>
            </div>
            <div>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{user.email}</span>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                >
                  <UserCircle size={24} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'search' && <SearchView />}
          {activeTab === 'add' && <AddRecipeView />}
          {activeTab === 'recipes' && <RecipesView />}
          {activeTab === 'plan' && <MealPlanView />}
          {activeTab === 'grocery' && <GroceryListView />}
        </div>
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;