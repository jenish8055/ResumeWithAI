import React, { useRef } from 'react';
import { FormInput } from '../../common/FormInput';
import { User, Mail, Phone, MapPin, Globe, Briefcase, Camera, Trash2 } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../../common/BrandIcons';
import { useResumeStore } from '../../../features/resume/resumeStore';

export default function PersonalInfoSection() {
  const { activeResume, updatePersonalInfo, showToast } = useResumeStore();
  const fileInputRef = useRef(null);

  if (!activeResume) return null;
  const p = activeResume.personalInfo || {};

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size should be under 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updatePersonalInfo('photo', event.target.result);
      showToast('Profile photo updated!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    updatePersonalInfo('photo', '');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
            Personal Information
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Recruiters will use these contact details to reach out to you.
          </p>
        </div>
      </div>

      {/* Photo Uploader */}
      <div className="flex items-center gap-5 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
        <div className="relative group">
          {p.photo ? (
            <img
              src={p.photo}
              alt={p.fullName || 'Profile'}
              className={`w-18 h-18 object-cover border-2 border-brand-500 shadow-sm ${
                p.photoShape === 'square' ? 'rounded-2xl' : 'rounded-full'
              }`}
            />
          ) : (
            <div className="w-18 h-18 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center border-2 border-dashed border-brand-300 dark:border-brand-700">
              <User className="w-8 h-8" />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs px-3 py-1.5 font-medium rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-brand-500 text-neutral-800 dark:text-neutral-200 cursor-pointer shadow-sm"
            >
              Upload Photo
            </button>
            {p.photo && (
              <button
                type="button"
                onClick={removePhoto}
                className="text-xs p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
                title="Remove photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Photo Shape Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400">Photo Display:</span>
            {['circle', 'square', 'none'].map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => updatePersonalInfo('photoShape', shape)}
                className={`text-[11px] px-2 py-0.5 rounded-md capitalize cursor-pointer ${
                  (p.photoShape || 'circle') === shape
                    ? 'bg-brand-500 text-white font-semibold'
                    : 'bg-neutral-200/60 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Full Name"
          name="fullName"
          value={p.fullName}
          onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
          placeholder="e.g. Alex Morgan"
          icon={User}
          required
        />
        <FormInput
          label="Professional Title"
          name="professionalTitle"
          value={p.professionalTitle}
          onChange={(e) => updatePersonalInfo('professionalTitle', e.target.value)}
          placeholder="e.g. Senior Frontend Engineer"
          icon={Briefcase}
          required
        />
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={p.email}
          onChange={(e) => updatePersonalInfo('email', e.target.value)}
          placeholder="e.g. alex.morgan@example.com"
          icon={Mail}
          required
        />
        <FormInput
          label="Phone Number"
          name="phone"
          value={p.phone}
          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
          placeholder="e.g. +1 (555) 019-2834"
          icon={Phone}
        />
        <FormInput
          label="Location (City, Country)"
          name="location"
          value={p.location}
          onChange={(e) => updatePersonalInfo('location', e.target.value)}
          placeholder="e.g. San Francisco, CA"
          icon={MapPin}
        />
        <FormInput
          label="Portfolio / Website"
          name="website"
          value={p.website}
          onChange={(e) => updatePersonalInfo('website', e.target.value)}
          placeholder="e.g. alexmorgan.dev"
          icon={Globe}
        />
        <FormInput
          label="LinkedIn URL"
          name="linkedin"
          value={p.linkedin}
          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
          placeholder="e.g. linkedin.com/in/alexmorgan"
          icon={LinkedinIcon}
        />
        <FormInput
          label="GitHub / Code Repository"
          name="github"
          value={p.github}
          onChange={(e) => updatePersonalInfo('github', e.target.value)}
          placeholder="e.g. github.com/alexmorgan"
          icon={GithubIcon}
        />
      </div>
    </div>
  );
}
