import React from 'react';
import { Book, Calendar, List, Search, Plus } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center p-4 transition-colors ${
      active
        ? 'text-emerald-600 bg-emerald-50'
        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
    }`}
  >
    {icon}
    <span className="mt-1 text-sm font-medium">{label}</span>
  </button>
);

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => (
  <nav className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between">
        <NavItem
          icon={<Search size={24} />}
          label="Search"
          active={activeTab === 'search'}
          onClick={() => onTabChange('search')}
        />
        <NavItem
          icon={<Plus size={24} />}
          label="Add Recipe"
          active={activeTab === 'add'}
          onClick={() => onTabChange('add')}
        />
        <NavItem
          icon={<Book size={24} />}
          label="Recipes"
          active={activeTab === 'recipes'}
          onClick={() => onTabChange('recipes')}
        />
        <NavItem
          icon={<Calendar size={24} />}
          label="Meal Plan"
          active={activeTab === 'plan'}
          onClick={() => onTabChange('plan')}
        />
        <NavItem
          icon={<List size={24} />}
          label="Grocery List"
          active={activeTab === 'grocery'}
          onClick={() => onTabChange('grocery')}
        />
      </div>
    </div>
  </nav>
);