'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  TouchButton,
  MobileForm,
  FormField,
  ResponsiveGrid,
  GridItem,
  SafeAreaView,
  SafeAreaProvider,
} from '@/components';

export default function ComponentsDemoPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [activeSection, setActiveSection] = useState<
    'container' | 'buttons' | 'form' | 'grid' | 'safe-area'
  >('container');

  const handleFormChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(`Form submitted: ${JSON.stringify(formData)}`);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface">
        {/* Header */}
        <div className="pt-6 pb-4 px-4 border-b border-border-dark sticky top-0 bg-dark-surface/95 backdrop-blur-sm z-50">
          <h1 className="text-h2 font-bold text-cyan-accent mb-2">
            DiveDrop Mobile Components
          </h1>
          <p className="text-text-secondary-light text-body">
            Showcase of responsive, touch-friendly components
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide sticky top-20 bg-dark-surface/80 backdrop-blur-sm z-40">
          {[
            { id: 'container' as const, label: 'Container' },
            { id: 'buttons' as const, label: 'Buttons' },
            { id: 'form' as const, label: 'Form' },
            { id: 'grid' as const, label: 'Grid' },
            { id: 'safe-area' as const, label: 'Safe Area' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 whitespace-nowrap text-sm ${
                activeSection === tab.id
                  ? 'bg-cyan-accent text-dark-bg'
                  : 'bg-dark-surface-elevated text-text-light hover:bg-dark-surface-elevated/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="px-4 py-6 pb-12">
          {/* 1. ResponsiveContainer Section */}
          {activeSection === 'container' && (
            <section className="space-y-6">
              <div>
                <h2 className="text-h3 font-bold text-cyan-accent mb-4">
                  Responsive Container
                </h2>
                <p className="text-text-secondary-light mb-4">
                  Adapts to all screen breakpoints: xs (320px), sm (640px), md (1024px), lg
                  (1280px), xl (1536px)
                </p>
              </div>

              {/* xs Breakpoint */}
              <div className="space-y-2">
                <p className="text-body-sm text-text-secondary-light font-medium">
                  Visible on XS (320px+)
                </p>
                <ResponsiveContainer className="xs:block hidden">
                  <div className="bg-gradient-to-r from-ocean-blue to-cyan-accent p-4 rounded-lg">
                    <p className="text-white font-semibold">XS Breakpoint</p>
                    <p className="text-white text-sm opacity-90">320px and up</p>
                  </div>
                </ResponsiveContainer>
              </div>

              {/* sm Breakpoint */}
              <div className="space-y-2">
                <p className="text-body-sm text-text-secondary-light font-medium">
                  Visible on SM (640px+)
                </p>
                <ResponsiveContainer className="sm:block hidden">
                  <div className="bg-gradient-to-r from-ocean-blue-light to-aqua p-6 rounded-lg">
                    <p className="text-white font-semibold">SM Breakpoint</p>
                    <p className="text-white text-sm opacity-90">640px and up</p>
                  </div>
                </ResponsiveContainer>
              </div>

              {/* md Breakpoint */}
              <div className="space-y-2">
                <p className="text-body-sm text-text-secondary-light font-medium">
                  Visible on MD (1024px+)
                </p>
                <ResponsiveContainer className="md:block hidden">
                  <div className="bg-gradient-to-r from-ocean-blue to-ocean-blue-light p-6 rounded-lg">
                    <p className="text-white font-semibold">MD Breakpoint</p>
                    <p className="text-white text-sm opacity-90">1024px and up</p>
                  </div>
                </ResponsiveContainer>
              </div>

              {/* Max Width Container */}
              <div className="space-y-2">
                <p className="text-body-sm text-text-secondary-light font-medium">
                  Max Width Container
                </p>
                <ResponsiveContainer>
                  <div className="bg-dark-surface-elevated border border-border-dark p-6 rounded-lg">
                    <p className="text-cyan-accent font-semibold mb-2">Responsive Max Width</p>
                    <p className="text-text-secondary-light text-sm">
                      Automatically centers and constrains to optimal width for content
                    </p>
                  </div>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {/* 2. TouchButton Section */}
          {activeSection === 'buttons' && (
            <section className="space-y-6">
              <div>
                <h2 className="text-h3 font-bold text-cyan-accent mb-4">Touch Buttons</h2>
                <p className="text-text-secondary-light mb-4">
                  Large touch targets (44px minimum) with haptic feedback support
                </p>
              </div>

              {/* Primary Button */}
              <div className="space-y-3">
                <p className="text-body-sm text-text-secondary-light font-medium">
                  Primary Variant
                </p>
                <div className="flex flex-wrap gap-3">
                  <TouchButton variant="primary">
                    Primary Button
                  </TouchButton>
                  <TouchButton variant="primary" disabled>
                    Disabled
                  </TouchButton>
                </div>
              </div>

              {/* Secondary Button */}
              <div className="space-y-3">
                <p className="text-body-sm text-text-secondary-light font-medium">
                  Secondary Variant
                </p>
                <div className="flex flex-wrap gap-3">
                  <TouchButton variant="secondary">
                    Secondary Button
                  </TouchButton>
                  <TouchButton variant="secondary" disabled>
                    Disabled
                  </TouchButton>
                </div>
              </div>

              {/* Outline Button */}
              <div className="space-y-3">
                <p className="text-body-sm text-text-secondary-light font-medium">
                  Outline Variant
                </p>
                <div className="flex flex-wrap gap-3">
                  <TouchButton variant="outline">
                    Outline Button
                  </TouchButton>
                  <TouchButton variant="outline" disabled>
                    Disabled
                  </TouchButton>
                </div>
              </div>

              {/* Danger Button */}
              <div className="space-y-3">
                <p className="text-body-sm text-text-secondary-light font-medium">
                  Danger Variant
                </p>
                <div className="flex flex-wrap gap-3">
                  <TouchButton variant="danger">
                    Delete Action
                  </TouchButton>
                  <TouchButton variant="danger" disabled>
                    Disabled
                  </TouchButton>
                </div>
              </div>

              {/* Size Variants */}
              <div className="space-y-3">
                <p className="text-body-sm text-text-secondary-light font-medium">
                  Size Variants
                </p>
                <div className="flex flex-col gap-3">
                  <TouchButton size="sm">Small Button</TouchButton>
                  <TouchButton size="md">Medium Button</TouchButton>
                  <TouchButton size="lg">Large Button</TouchButton>
                </div>
              </div>

              {/* Full Width */}
              <div className="space-y-3">
                <p className="text-body-sm text-text-secondary-light font-medium">
                  Full Width
                </p>
                <TouchButton className="w-full">Full Width Button</TouchButton>
              </div>
            </section>
          )}

          {/* 3. MobileForm Section */}
          {activeSection === 'form' && (
            <section className="space-y-6">
              <div>
                <h2 className="text-h3 font-bold text-cyan-accent mb-4">Mobile Form</h2>
                <p className="text-text-secondary-light mb-4">
                  Touch-optimized form with email and password fields
                </p>
              </div>

              <div className="bg-dark-surface-elevated border border-border-dark rounded-lg p-6">
                <MobileForm onSubmit={handleFormSubmit}>
                  <FormField
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={(value) => handleFormChange('email', value)}
                    helpText="We'll never share your email"
                  />

                  <FormField
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={(value) => handleFormChange('password', value)}
                    helpText="Minimum 8 characters"
                  />

                  <div className="flex gap-3 pt-2">
                    <TouchButton type="submit" className="flex-1">
                      Sign In
                    </TouchButton>
                    <TouchButton
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setFormData({ email: '', password: '' })}
                    >
                      Clear
                    </TouchButton>
                  </div>
                </MobileForm>

                {formData.email && (
                  <div className="mt-4 p-3 bg-dark-bg rounded-md border border-cyan-accent/20">
                    <p className="text-text-secondary-light text-sm">
                      <span className="text-cyan-accent font-medium">Form Data:</span>
                      <br />
                      Email: {formData.email}
                      <br />
                      Password: {'*'.repeat(Math.min(formData.password.length, 8))}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 4. ResponsiveGrid Section */}
          {activeSection === 'grid' && (
            <section className="space-y-6">
              <div>
                <h2 className="text-h3 font-bold text-cyan-accent mb-4">Responsive Grid</h2>
                <p className="text-text-secondary-light mb-4">
                  Flexible grid that adapts columns based on screen size
                </p>
              </div>

              <ResponsiveGrid>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <GridItem key={item}>
                    <div className="bg-gradient-to-br from-ocean-blue to-cyan-accent/40 rounded-lg p-6 h-full flex flex-col justify-center items-center hover:shadow-elevation-3 transition-shadow duration-200">
                      <div className="text-white font-bold text-h3 mb-2">{item}</div>
                      <p className="text-white text-sm text-center opacity-90">
                        Card {item}
                      </p>
                      <div className="mt-4 text-xs text-white/70">
                        Responsive item
                      </div>
                    </div>
                  </GridItem>
                ))}
              </ResponsiveGrid>

              {/* Grid Info */}
              <div className="bg-dark-surface-elevated border border-border-dark rounded-lg p-4">
                <p className="text-text-secondary-light text-sm">
                  <span className="text-cyan-accent font-medium block mb-2">Breakpoint Columns:</span>
                  XS: 1 column | SM: 2 columns | MD: 3 columns | LG: 4 columns
                </p>
              </div>
            </section>
          )}

          {/* 5. SafeAreaView Section */}
          {activeSection === 'safe-area' && (
            <section className="space-y-6">
              <div>
                <h2 className="text-h3 font-bold text-cyan-accent mb-4">Safe Area View</h2>
                <p className="text-text-secondary-light mb-4">
                  Respects device safe areas (notches, home indicators)
                </p>
              </div>

              <div className="bg-dark-surface-elevated border border-border-dark rounded-lg p-6">
                <h3 className="text-h4 text-cyan-accent mb-4">Demo Layout</h3>

                {/* Header with Safe Area */}
                <div className="mb-4 -mx-6 -mt-6">
                  <div className="bg-ocean-blue text-white p-4 min-h-16 flex items-center rounded-t-lg pt-safe-top">
                    <p className="font-semibold">Header (Safe Top)</p>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <p className="text-text-light">This area respects safe insets</p>
                  <div className="bg-dark-bg p-4 rounded-md text-text-secondary-light text-sm">
                    On devices with notches or home indicators, content automatically adjusts padding
                    to avoid overlapping with UI elements.
                  </div>
                </div>

                {/* Footer with Safe Area */}
                <div className="mt-6 -mx-6 -mb-6">
                  <div className="bg-ocean-blue text-white p-4 min-h-14 flex items-center rounded-b-lg pb-safe-bottom">
                    <p className="font-semibold">Footer (Safe Bottom)</p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-dark-bg border border-cyan-accent/20 rounded-lg p-4">
                <p className="text-text-secondary-light text-sm">
                  <span className="text-cyan-accent font-medium block mb-2">CSS Variables:</span>
                  --safe-area-inset-top: Auto-detected
                  <br />
                  --safe-area-inset-bottom: Auto-detected
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 pb-20 px-4 border-t border-border-dark text-center">
          <p className="text-text-secondary-light text-sm mb-2">
            DiveDrop Component Library v1.0
          </p>
          <p className="text-text-secondary-light text-xs opacity-70">
            All components are fully responsive and touch-optimized
          </p>
        </div>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
