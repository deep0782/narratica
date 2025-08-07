'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Search, Grid, List, SlidersHorizontal } from 'lucide-react'
import type { Child } from '@/lib/supabase'

interface SearchAndFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedChild: string
  onChildChange: (childId: string) => void
  selectedTheme: string
  onThemeChange: (theme: string) => void
  sortBy: 'recent' | 'title' | 'child'
  onSortChange: (sort: 'recent' | 'title' | 'child') => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  children: Child[]
}

const EDUCATIONAL_THEMES = [
  { value: 'all', label: 'All Themes' },
  { value: 'friendship', label: 'Friendship & Sharing' },
  { value: 'courage', label: 'Overcoming Fears' },
  { value: 'learning', label: 'Learning New Skills' },
  { value: 'family', label: 'Family Values' },
  { value: 'adventure', label: 'Adventure & Exploration' },
  { value: 'problem-solving', label: 'Problem Solving' },
  { value: 'custom', label: 'Custom Stories' }
]

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  selectedChild,
  onChildChange,
  selectedTheme,
  onThemeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  children
}: SearchAndFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search stories by title or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 rounded-lg border-gray-200 focus:border-purple-300 focus:ring-purple-200"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Child Filter */}
          <Select value={selectedChild} onValueChange={onChildChange}>
            <SelectTrigger className="w-40 rounded-lg">
              <SelectValue placeholder="All Children" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Children</SelectItem>
              {children.map(child => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Theme Filter */}
          <Select value={selectedTheme} onValueChange={onThemeChange}>
            <SelectTrigger className="w-48 rounded-lg">
              <SelectValue placeholder="All Themes" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATIONAL_THEMES.map(theme => (
                <SelectItem key={theme.value} value={theme.value}>
                  {theme.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-36 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="child">By Child</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={`rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className={`rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedChild !== 'all' || selectedTheme !== 'all') && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          <SlidersHorizontal className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">Active filters:</span>
          
          {searchQuery && (
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
              Search: "{searchQuery}"
            </span>
          )}
          
          {selectedChild !== 'all' && (
            <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs">
              Child: {children.find(c => c.id === selectedChild)?.name}
            </span>
          )}
          
          {selectedTheme !== 'all' && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              Theme: {EDUCATIONAL_THEMES.find(t => t.value === selectedTheme)?.label}
            </span>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange('')
              onChildChange('all')
              onThemeChange('all')
            }}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
