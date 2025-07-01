import React from 'react';
import { Check, FileText, Users, Eye, Download } from 'lucide-react';

export type TabType = 'templates' | 'guests' | 'preview' | 'export';
export type StepStatus = 'completed' | 'current' | 'accessible' | 'disabled';

interface Step {
  id: TabType;
  label: string;
  icon: React.ComponentType<any>;
  shortLabel?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: TabType;
  onStepClick: (stepId: TabType) => void;
  getStepStatus: (stepId: TabType) => StepStatus;
  variant?: 'desktop' | 'mobile';
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  getStepStatus,
  variant = 'desktop'
}) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  if (variant === 'mobile') {
    return (
      <div className="w-full">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Langkah {currentStepIndex + 1} dari {steps.length}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Mobile Stepper */}
        <div className="relative flex justify-between items-center">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;
            const isClickable = status !== 'disabled';

            return (
              <div key={step.id} className="flex flex-col items-center flex-1 relative">
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div 
                    className="absolute top-4 bg-gray-200 h-0.5 -z-10"
                    style={{ 
                      left: '50%',
                      right: `calc(-100% + 2rem)`,
                      width: `calc(100vw / ${steps.length} - 2rem)`
                    }}
                  />
                )}

                {/* Step Circle */}
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    status === 'completed'
                      ? 'bg-green-500 text-white'
                      : status === 'current'
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                      : status === 'accessible'
                      ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {status === 'completed' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>

                {/* Step Label */}
                <span className={`text-xs mt-1 text-center ${
                  status === 'current' 
                    ? 'text-rose-600 font-medium' 
                    : status === 'disabled'
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}>
                  {step.shortLabel || step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop variant
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Langkah {currentStepIndex + 1} dari {steps.length}</span>
          <span>{Math.round(progressPercentage)}% Selesai</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="relative">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;
            const isClickable = status !== 'disabled';

            return (
              <div key={step.id} className="flex flex-col items-center relative">
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div 
                    className="absolute top-6 bg-gray-200 h-0.5 -z-10"
                    style={{ 
                      left: '50%',
                      width: `calc(100% / ${steps.length - 1} * ${steps.length} - 3rem)`
                    }}
                  />
                )}

                {/* Step Circle */}
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all mb-2 ${
                    status === 'completed'
                      ? 'bg-green-500 text-white shadow-lg hover:bg-green-600'
                      : status === 'current'
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                      : status === 'accessible'
                      ? 'bg-white border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                      : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>

                {/* Step Icon */}
                <div className={`mb-2 ${
                  status === 'current' 
                    ? 'text-rose-600' 
                    : status === 'disabled'
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Step Label */}
                <span className={`text-sm font-medium text-center ${
                  status === 'current' 
                    ? 'text-rose-600' 
                    : status === 'disabled'
                    ? 'text-gray-400'
                    : 'text-gray-700'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
