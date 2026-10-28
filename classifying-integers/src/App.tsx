/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  Sparkles, 
  GripVertical,
  Check,
  Undo2
} from 'lucide-react';

/* ==========================================================================
   TYPE DEFINITIONS & DATA MODELS
   ========================================================================== */

/** The three sorting categories for the activity */
export type CategoryId = 'positive' | 'negative' | 'not-integer';

/** Represents a single draggable number */
export interface NumberItem {
  id: string;
  display: string;
  correctCategory: CategoryId;
  explanation: string;
}

/** Definition for each drop category */
export interface Category {
  id: CategoryId;
  title: string;
  subtitle: string;
  maxItems: number;
}

/* ==========================================================================
   INITIAL DATA CONFIGURATION
   Preserving all 9 numbers and categories exactly as specified:
   - Positive integers: 25, 7, 12
   - Negative integers: -8, -15, -3
   - Not integers: 1/2, 2.5, -3/4
   ========================================================================== */

const INITIAL_NUMBERS: NumberItem[] = [
  {
    id: 'num-25',
    display: '25',
    correctCategory: 'positive',
    explanation: '25 is a whole number greater than 0, making it a positive integer.'
  },
  {
    id: 'num-neg-8',
    display: '-8',
    correctCategory: 'negative',
    explanation: '-8 is the opposite of the whole number 8, making it a negative integer.'
  },
  {
    id: 'num-half',
    display: '1/2',
    correctCategory: 'not-integer',
    explanation: '1/2 is a fraction (a part of a whole), so it is not an integer.'
  },
  {
    id: 'num-7',
    display: '7',
    correctCategory: 'positive',
    explanation: '7 is a whole counting number, so it is a positive integer.'
  },
  {
    id: 'num-neg-15',
    display: '-15',
    correctCategory: 'negative',
    explanation: '-15 is a whole number with a negative sign, making it a negative integer.'
  },
  {
    id: 'num-2-point-5',
    display: '2.5',
    correctCategory: 'not-integer',
    explanation: '2.5 has a decimal component, meaning it is not a whole number.'
  },
  {
    id: 'num-12',
    display: '12',
    correctCategory: 'positive',
    explanation: '12 is a whole positive number, making it a positive integer.'
  },
  {
    id: 'num-neg-3',
    display: '-3',
    correctCategory: 'negative',
    explanation: '-3 is the opposite of 3, making it a negative integer.'
  },
  {
    id: 'num-neg-three-fourths',
    display: '-3/4',
    correctCategory: 'not-integer',
    explanation: '-3/4 is a negative fraction, so it is not a whole number or integer.'
  }
];

const CATEGORIES: Category[] = [
  {
    id: 'positive',
    title: 'Positive Integer',
    subtitle: 'Whole numbers greater than 0',
    maxItems: 3
  },
  {
    id: 'negative',
    title: 'Negative Integer',
    subtitle: 'Whole numbers less than 0',
    maxItems: 3
  },
  {
    id: 'not-integer',
    title: 'Not an Integer',
    subtitle: 'Fractions and decimals',
    maxItems: 3
  }
];

export default function App() {
  /* ==========================================================================
     STATE MANAGEMENT
     - placements: maps number ID to current category ID (or undefined if in pool)
     - draggedId: ID of number currently being dragged via HTML5 drag-and-drop
     - selectedId: ID of number selected for click/tap to place (touch accessibility)
     - activeDropZone: tracks which drop zone is currently hovered for highlighting
     ========================================================================== */
  const [placements, setPlacements] = useState<Record<string, CategoryId | undefined>>({});
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const [showHelperModal, setShowHelperModal] = useState<boolean>(false);

  /* Helper function to get items currently in a category */
  const getItemsInCategory = (categoryId: CategoryId): NumberItem[] => {
    return INITIAL_NUMBERS.filter((item) => placements[item.id] === categoryId);
  };

  /* Helper function to get items still in the unclassified pool */
  const unclassifiedItems: NumberItem[] = INITIAL_NUMBERS.filter(
    (item) => !placements[item.id]
  );

  /* Total correctly placed numbers */
  const correctCount = INITIAL_NUMBERS.filter(
    (item) => placements[item.id] && placements[item.id] === item.correctCategory
  ).length;

  const totalClassified = INITIAL_NUMBERS.filter((item) => placements[item.id]).length;
  const isComplete = correctCount === INITIAL_NUMBERS.length;

  /* ==========================================================================
     DRAG AND DROP HANDLERS (HTML5 Drag & Drop)
     ========================================================================== */

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setActiveDropZone(null);
  };

  const handleDragOver = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropZone !== zoneId) {
      setActiveDropZone(zoneId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, zoneId: string) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (activeDropZone === zoneId) {
      setActiveDropZone(null);
    }
  };

  /** Move an item into a category or back to the pool */
  const moveItem = (itemId: string, targetCategory: CategoryId | null) => {
    if (targetCategory === null) {
      // Return to unclassified pool
      setPlacements((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
      setSelectedId(null);
      return;
    }

    const currentItemsInTarget = getItemsInCategory(targetCategory);
    const isAlreadyInTarget = placements[itemId] === targetCategory;

    // Check capacity limit: maximum 3 numbers per category
    if (!isAlreadyInTarget && currentItemsInTarget.length >= 3) {
      return;
    }

    setPlacements((prev) => ({
      ...prev,
      [itemId]: targetCategory
    }));
    setSelectedId(null);
  };

  const handleDropOnCategory = (e: React.DragEvent, categoryId: CategoryId) => {
    e.preventDefault();
    setActiveDropZone(null);
    const itemId = e.dataTransfer.getData('text/plain') || draggedId;
    if (itemId) {
      moveItem(itemId, categoryId);
    }
  };

  const handleDropOnPool = (e: React.DragEvent) => {
    e.preventDefault();
    setActiveDropZone(null);
    const itemId = e.dataTransfer.getData('text/plain') || draggedId;
    if (itemId) {
      moveItem(itemId, null);
    }
  };

  /* ==========================================================================
     CLICK & TAP ACCESSIBILITY HANDLER
     Allows keyboard/touch students to tap a number, then tap a destination.
     ========================================================================== */
  const handleItemClick = (item: NumberItem) => {
    if (selectedId === item.id) {
      setSelectedId(null);
    } else {
      setSelectedId(item.id);
    }
  };

  const handleCategoryClick = (categoryId: CategoryId) => {
    if (selectedId) {
      moveItem(selectedId, categoryId);
    }
  };

  const handleReset = () => {
    setPlacements({});
    setDraggedId(null);
    setSelectedId(null);
    setActiveDropZone(null);
  };

  return (
    <div className="min-h-screen bg-[#F3EEFA] text-[#2D1A47] flex flex-col font-sans">
      {/* Top Application Bar */}
      <header className="bg-white/95 backdrop-blur-xs border-b border-[#9370DB]/30 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4B0082] text-white flex items-center justify-center font-bold text-xl shadow-sm ring-2 ring-[#9370DB]/30">
              ±
            </div>
            <div>
              {/* Dark plum (#4B0082) for main title */}
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#4B0082]">
                Classifying Integers
              </h1>
              <p className="text-xs text-[#663399]/80 font-medium hidden sm:block">
                Sixth-Grade Mathematics Sorting Activity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowHelperModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#4B0082] bg-[#E6D6FA]/80 hover:bg-[#E6D6FA] border border-[#9370DB]/40 rounded-xl shadow-2xs transition-all cursor-pointer hover:shadow-xs active:scale-98"
              title="What is an integer?"
            >
              <HelpCircle className="w-4 h-4 text-[#663399]" />
              <span>Integer Rules</span>
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#4B0082] bg-white hover:bg-[#F3EEFA] border border-[#9370DB]/50 rounded-xl shadow-2xs transition-all cursor-pointer hover:shadow-xs active:scale-98"
              title="Reset all numbers to the pool"
            >
              <RotateCcw className="w-4 h-4 text-[#663399]" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        
        {/* Student Instructions Banner - clearly visible and high contrast */}
        <section 
          aria-label="Student Instructions"
          className="bg-white border-2 border-[#9370DB]/40 rounded-2xl p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-[#E6D6FA] text-[#4B0082] rounded-xl shrink-0 mt-0.5 shadow-2xs">
              <Sparkles className="w-5 h-5 text-[#663399]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xs font-bold text-[#663399] uppercase tracking-wider mb-1">
                Student Instructions
              </h2>
              {/* Preserving exact prompt instructions */}
              <p className="text-sm sm:text-base text-[#2D1A47] leading-relaxed font-medium">
                Drag each number into the correct category. Remember, integers are whole numbers and their opposites, including zero. Each category contains only 3 numbers. Correct answers turn green, and incorrect answers turn red.
              </p>
              
              <p className="text-xs text-[#663399] mt-2 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9370DB]"></span>
                Tip: You can drag and drop with a mouse, or tap any number to select it and tap a category box.
              </p>
            </div>
          </div>
        </section>

        {/* Progress & Feedback Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#9370DB]/30 rounded-2xl px-5 py-3.5 shadow-xs">
          <div className="flex items-center gap-5">
            <div>
              <span className="text-[#663399] text-xs uppercase font-bold tracking-wider">Progress</span>
              <p className="font-bold text-[#2D1A47] text-base">
                <span className="tabular-nums text-[#4B0082]">{totalClassified}</span> / 9 Classified
              </p>
            </div>
            <div className="h-8 w-px bg-[#9370DB]/30" />
            <div>
              <span className="text-[#663399] text-xs uppercase font-bold tracking-wider">Score</span>
              <p className="font-bold text-emerald-700 text-base">
                <span className="tabular-nums">{correctCount}</span> / 9 Correct
              </p>
            </div>
          </div>

          {/* Completion Celebration Message */}
          {isComplete ? (
            <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-400 px-4 py-2 rounded-xl text-sm font-bold shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Outstanding job! All 9 numbers are classified correctly!</span>
            </div>
          ) : selectedId ? (
            <div className="flex items-center gap-2 text-[#4B0082] bg-[#E6D6FA] border border-[#9370DB] px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-2xs">
              <span>Selected number: <strong className="text-base font-mono">{INITIAL_NUMBERS.find(n => n.id === selectedId)?.display}</strong>. Tap a category to place it.</span>
              <button 
                onClick={() => setSelectedId(null)}
                className="text-[#663399] underline ml-2 cursor-pointer font-bold hover:text-[#4B0082]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="text-xs font-medium text-[#663399]">
              Each category holds a maximum of 3 numbers.
            </div>
          )}
        </div>

        {/* Activity Workspace: 2-Zone Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================================================================
              ZONE 1: Numbers to Classify Pool (Left Column, lg:col-span-4)
              ================================================================ */}
          <section 
            aria-label="Numbers to Classify Pool"
            className={`lg:col-span-4 bg-white border-2 rounded-2xl p-4 sm:p-5 shadow-sm transition-all ${
              activeDropZone === 'pool' 
                ? 'border-[#9370DB] bg-[#F0E6FC] lavender-drop-active ring-4 ring-[#9370DB]/30' 
                : 'border-[#9370DB]/30'
            }`}
            onDragOver={(e) => handleDragOver(e, 'pool')}
            onDragLeave={(e) => handleDragLeave(e, 'pool')}
            onDrop={handleDropOnPool}
            onClick={() => {
              if (selectedId && placements[selectedId]) {
                moveItem(selectedId, null);
              }
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#9370DB]/20 mb-4">
              <div>
                {/* Medium purple (#663399) heading */}
                <h2 className="text-base sm:text-lg font-bold text-[#663399]">
                  Numbers to Classify
                </h2>
                <p className="text-xs text-[#2D1A47]/70 font-medium">
                  {unclassifiedItems.length} number{unclassifiedItems.length === 1 ? '' : 's'} remaining
                </p>
              </div>
              <span className="text-xs font-semibold text-[#4B0082] bg-[#E6D6FA] border border-[#9370DB]/40 px-2.5 py-0.5 rounded-lg">
                Pool
              </span>
            </div>

            {/* List of draggable numbers in the pool */}
            <div className="min-h-[300px] flex flex-col gap-3">
              {unclassifiedItems.length === 0 ? (
                <div className="h-48 border-2 border-dashed border-[#9370DB]/40 rounded-xl flex flex-col items-center justify-center text-center p-4 text-[#663399] bg-[#F3EEFA]/50">
                  <Check className="w-8 h-8 text-emerald-600 mb-1" />
                  <p className="text-sm font-bold text-[#4B0082]">All numbers placed!</p>
                  <p className="text-xs text-[#663399] mt-1 max-w-[200px]">
                    Drag any number back here if you want to rethink your answer.
                  </p>
                </div>
              ) : (
                unclassifiedItems.map((item) => {
                  const isSelected = selectedId === item.id;
                  const isBeingDragged = draggedId === item.id;

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(item);
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Number ${item.display}. Draggable to category.`}
                      /* 
                         Draggable Number Cards:
                         - Light lavender (#E6D6FA) background
                         - Medium purple (#9370DB) border
                         - Visually distinct, comfortable spacing, slightly rounded corners
                         - Dark plum (#310D59) high contrast text
                      */
                      className={`group relative flex items-center justify-between px-4 py-3.5 bg-[#E6D6FA] border-2 rounded-xl cursor-grab active:cursor-grabbing select-none transition-all shadow-xs ${
                        isSelected 
                          ? 'border-[#4B0082] ring-3 ring-[#9370DB]/60 bg-[#D8C2F8] scale-[1.02] shadow-md' 
                          : 'border-[#9370DB]/50 hover:border-[#9370DB] hover:bg-[#DECAFA] hover:shadow-md hover:-translate-y-0.5'
                      } ${isBeingDragged ? 'opacity-40 scale-95' : 'opacity-100'}`}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-[#663399]/70 group-hover:text-[#4B0082] transition-colors shrink-0" />
                        <span className="text-xl font-bold text-[#310D59] tracking-tight font-mono">
                          {item.display}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#663399] group-hover:text-[#4B0082] transition-colors">
                        {isSelected ? 'Selected' : 'Drag / Tap'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* ================================================================
              ZONE 2: Three Sorting Categories (Right Area, lg:col-span-8)
              - 1. Positive Integer
              - 2. Negative Integer
              - 3. Not an Integer
              ================================================================ */}
          <section 
            aria-label="Sorting Categories"
            className="lg:col-span-8 flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
              {CATEGORIES.map((category) => {
                const items = getItemsInCategory(category.id);
                const isFull = items.length >= category.maxItems;
                const isTargetHovered = activeDropZone === category.id;
                const canAcceptSelected = selectedId && !isFull && placements[selectedId] !== category.id;

                return (
                  <div
                    key={category.id}
                    onDragOver={(e) => handleDragOver(e, category.id)}
                    onDragLeave={(e) => handleDragLeave(e, category.id)}
                    onDrop={(e) => handleDropOnCategory(e, category.id)}
                    onClick={() => handleCategoryClick(category.id)}
                    /*
                      Sorting categories styling:
                      - Rounded corners (rounded-2xl)
                      - Subtle shadows (shadow-sm / hover:shadow-md)
                      - Gentle lavender highlighting effect when dragged over
                    */
                    className={`relative flex flex-col bg-white border-2 rounded-2xl p-4 sm:p-4.5 min-h-[380px] transition-all shadow-sm ${
                      isTargetHovered
                        ? isFull
                          ? 'border-red-400 bg-red-50/40 ring-4 ring-red-200'
                          : 'border-[#9370DB] bg-[#F0E6FC] lavender-drop-active ring-4 ring-[#9370DB]/30 shadow-md scale-[1.01]'
                        : canAcceptSelected
                        ? 'border-[#9370DB] ring-2 ring-[#9370DB]/30 bg-[#F8F4FD] cursor-pointer'
                        : 'border-[#9370DB]/30 hover:border-[#9370DB]/60 hover:shadow-md'
                    }`}
                  >
                    {/* Category Header */}
                    <div className="pb-3 border-b border-[#9370DB]/20 mb-3.5">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        {/* Medium purple (#663399) for category headings */}
                        <h3 className="text-base font-bold text-[#663399] tracking-tight">
                          {category.title}
                        </h3>
                        {/* Slot counter indicator */}
                        <span 
                          className={`text-xs font-bold px-2 py-0.5 rounded-lg tabular-nums border ${
                            isFull 
                              ? 'bg-amber-100 text-amber-900 border-amber-300' 
                              : 'bg-[#E6D6FA] text-[#4B0082] border-[#9370DB]/40'
                          }`}
                        >
                          {items.length} / {category.maxItems}
                        </span>
                      </div>
                      <p className="text-xs text-[#2D1A47]/70 font-medium">
                        {category.subtitle}
                      </p>
                    </div>

                    {/* Draggable Drop Area / Placed Cards Container */}
                    <div className="flex-1 flex flex-col gap-2.5">
                      {items.map((item) => {
                        const isCorrect = item.correctCategory === category.id;
                        const isBeingDragged = draggedId === item.id;
                        const isSelected = selectedId === item.id;

                        return (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.id)}
                            onDragEnd={handleDragEnd}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleItemClick(item);
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={`Number ${item.display} classified as ${category.title}. Status: ${
                              isCorrect ? 'Correct' : 'Incorrect'
                            }.`}
                            /* 
                               PRESERVING FEEDBACK REQUIREMENT:
                               - Correct answers turn green.
                               - Incorrect answers turn red.
                               - Students can move incorrect answers to another category.
                            */
                            className={`group relative flex items-center justify-between px-3.5 py-3 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing select-none shadow-xs ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-400/50 hover:bg-emerald-100/60'
                                : 'bg-red-50 border-red-500 text-red-950 ring-1 ring-red-400/50 hover:bg-red-100/60'
                            } ${isBeingDragged ? 'opacity-40 scale-95' : 'opacity-100'} ${
                              isSelected ? 'ring-3 ring-[#4B0082] scale-[1.02]' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <GripVertical 
                                className={`w-4 h-4 shrink-0 ${
                                  isCorrect ? 'text-emerald-600' : 'text-red-500'
                                }`} 
                              />
                              <span className="text-xl font-bold font-mono tracking-tight">
                                {item.display}
                              </span>
                            </div>

                            {/* Status Indicator & Return Action */}
                            <div className="flex items-center gap-2 shrink-0">
                              {isCorrect ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Correct</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-800 bg-red-100/80 px-2 py-0.5 rounded-md border border-red-300">
                                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                                  <span>Try Again</span>
                                </span>
                              )}

                              {/* Button to quickly return number back to pool */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveItem(item.id, null);
                                }}
                                title="Return to numbers pool"
                                aria-label="Return to pool"
                                className={`p-1 rounded-md hover:bg-white/80 transition-colors cursor-pointer ${
                                  isCorrect ? 'text-emerald-800' : 'text-red-800'
                                }`}
                              >
                                <Undo2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Empty Slot Placeholders up to max of 3 */}
                      {Array.from({ length: category.maxItems - items.length }).map((_, index) => (
                        <div
                          key={`empty-${category.id}-${index}`}
                          className={`h-14 border-2 border-dashed rounded-xl flex items-center justify-center text-xs transition-colors ${
                            isTargetHovered && !isFull
                              ? 'border-[#9370DB] bg-[#E6D6FA]/40 text-[#4B0082] font-semibold'
                              : 'border-[#9370DB]/30 bg-[#F3EEFA]/40 text-[#663399]/70 font-medium'
                          }`}
                        >
                          {index === 0 && items.length === 0 ? 'Drop a number here' : 'Empty Slot'}
                        </div>
                      ))}
                    </div>

                    {/* Notice if category reached capacity */}
                    {isFull && (
                      <div className="mt-3 text-center text-xs font-semibold text-[#663399] bg-[#E6D6FA] border border-[#9370DB]/30 py-1.5 px-2 rounded-lg">
                        Category is full (3/3)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Reference / Explanations for Students */}
            <div className="bg-white border-2 border-[#9370DB]/30 rounded-2xl p-4 sm:p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#663399] mb-2.5">
                Quick Guide & Explanations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs text-[#2D1A47]">
                <div className="p-3 rounded-xl bg-[#F3EEFA] border border-[#9370DB]/30">
                  <p className="font-bold text-[#4B0082] mb-1">Positive Integers</p>
                  <p className="leading-relaxed">Whole numbers strictly greater than zero: <strong>7, 12, 25</strong>. No fractions or decimals.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F3EEFA] border border-[#9370DB]/30">
                  <p className="font-bold text-[#4B0082] mb-1">Negative Integers</p>
                  <p className="leading-relaxed">Whole numbers strictly less than zero: <strong>-3, -8, -15</strong>. Whole numbers with a negative sign.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F3EEFA] border border-[#9370DB]/30">
                  <p className="font-bold text-[#4B0082] mb-1">Not an Integer</p>
                  <p className="leading-relaxed">Numbers with fractional or decimal parts: <strong>1/2, 2.5, -3/4</strong>. They represent parts of whole numbers.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Integer Help / Rules Modal */}
      {showHelperModal && (
        <div 
          className="fixed inset-0 z-50 bg-[#2D1A47]/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowHelperModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-[#9370DB]/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#9370DB]/20 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#E6D6FA] rounded-lg">
                  <HelpCircle className="w-5 h-5 text-[#4B0082]" />
                </div>
                <h3 className="text-lg font-bold text-[#4B0082]">What is an Integer?</h3>
              </div>
              <button
                onClick={() => setShowHelperModal(false)}
                className="text-[#663399] hover:text-[#4B0082] hover:bg-[#E6D6FA] p-1.5 rounded-lg cursor-pointer text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-[#2D1A47] leading-relaxed">
              <p>
                An <strong>integer</strong> is any whole number (positive, negative, or zero). Integers do <strong>not</strong> include fractions, decimals, or mixed numbers.
              </p>

              <div className="space-y-2.5 border-l-3 border-[#9370DB] pl-3.5 bg-[#F3EEFA]/70 p-3 rounded-r-xl">
                <p>
                  <strong className="text-[#4B0082]">Positive Integers:</strong> {`{1, 2, 3, 4, 7, 12, 25, ...}`}
                </p>
                <p>
                  <strong className="text-[#4B0082]">Zero:</strong> Zero is an integer, but it is neither positive nor negative.
                </p>
                <p>
                  <strong className="text-[#4B0082]">Negative Integers:</strong> {`{..., -15, -8, -3, -2, -1}`}
                </p>
                <p>
                  <strong className="text-[#4B0082]">Not Integers:</strong> Decimals like <code>2.5</code>, fractions like <code>1/2</code> and <code>-3/4</code>.
                </p>
              </div>

              <div className="bg-[#E6D6FA]/60 border border-[#9370DB]/30 p-3 rounded-xl text-xs text-[#2D1A47]">
                <strong>Remember:</strong> If you move a number into the wrong box, it will turn red. You can always drag it to another box or click the return button to try again!
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelperModal(false)}
                className="px-5 py-2.5 bg-[#4B0082] hover:bg-[#3B0066] text-white rounded-xl text-sm font-semibold transition-all shadow-xs hover:shadow-sm cursor-pointer"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-[#9370DB]/20 bg-white/80 py-4 text-center text-xs font-medium text-[#663399]">
        Classifying Integers · 6th Grade Mathematics Sorting Activity
      </footer>
    </div>
  );
}
