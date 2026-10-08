import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { FormInput, FormTextarea } from '../components/common/FormInput';
import { createSampleBiodata } from '../features/resume/resumeModel';
import { exportService } from '../services/export/exportService';
import { Users, Download, Printer, Sparkles, User, Heart, Home, Briefcase } from 'lucide-react';

export default function BiodataPage() {
  const [biodata, setBiodata] = useState(createSampleBiodata());
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'astrology' | 'family' | 'career'

  const p = biodata.personalInfo;
  const b = biodata.biodataDetails;

  const updatePersonal = (field, val) => {
    setBiodata((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: val },
    }));
  };

  const updateDetail = (field, val) => {
    setBiodata((prev) => ({
      ...prev,
      biodataDetails: { ...prev.biodataDetails, [field]: val },
    }));
  };

  const handleDownloadPdf = () => {
    exportService.downloadPdf('biodata-paper', `${p.fullName || 'Biodata'}_Biodata.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <DashboardSidebar />

        <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Badge variant="brand" icon={Users}>Biodata Creator</Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white mt-1">
                Matrimonial & Personal Biodata Builder
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500">
                Create elegant traditional or modern marriage biodatas with family details and astrology.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" icon={Printer} onClick={() => exportService.print()}>
                Print
              </Button>
              <Button variant="primary" size="sm" icon={Download} onClick={handleDownloadPdf}>
                Download PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Editor (6 cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-soft space-y-6">
              {/* Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs font-bold overflow-x-auto">
                {[
                  { id: 'personal', label: 'Personal' },
                  { id: 'astrology', label: 'Astrology' },
                  { id: 'career', label: 'Career & Edu' },
                  { id: 'family', label: 'Family Details' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3.5 py-2 rounded-lg transition-all shrink-0 cursor-pointer ${
                      activeTab === t.id
                        ? 'bg-white dark:bg-neutral-900 text-brand-600 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Personal */}
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <FormInput label="Full Name" value={p.fullName} onChange={(e) => updatePersonal('fullName', e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <FormInput label="Date of Birth" value={b.dob} onChange={(e) => updateDetail('dob', e.target.value)} placeholder="e.g. 15 Aug 1996" />
                    <FormInput label="Time of Birth" value={b.timeOfBirth} onChange={(e) => updateDetail('timeOfBirth', e.target.value)} placeholder="e.g. 07:30 AM" />
                    <FormInput label="Place of Birth" value={b.placeOfBirth} onChange={(e) => updateDetail('placeOfBirth', e.target.value)} placeholder="e.g. Mumbai" />
                    <FormInput label="Height" value={b.height} onChange={(e) => updateDetail('height', e.target.value)} placeholder="e.g. 5 ft 11 in (180 cm)" />
                    <FormInput label="Blood Group" value={b.bloodGroup} onChange={(e) => updateDetail('bloodGroup', e.target.value)} placeholder="e.g. B+ Positive" />
                    <FormInput label="Complexion" value={b.complexion} onChange={(e) => updateDetail('complexion', e.target.value)} placeholder="e.g. Fair" />
                  </div>
                  <FormInput label="Photo URL" value={p.photo} onChange={(e) => updatePersonal('photo', e.target.value)} placeholder="https://..." />
                </div>
              )}

              {/* Tab 2: Astrology */}
              {activeTab === 'astrology' && (
                <div className="grid grid-cols-2 gap-3">
                  <FormInput label="Religion" value={b.religion} onChange={(e) => updateDetail('religion', e.target.value)} />
                  <FormInput label="Caste" value={b.caste} onChange={(e) => updateDetail('caste', e.target.value)} />
                  <FormInput label="Gothra" value={b.gothra} onChange={(e) => updateDetail('gothra', e.target.value)} />
                  <FormInput label="Rashi (Moon Sign)" value={b.rashi} onChange={(e) => updateDetail('rashi', e.target.value)} />
                  <FormInput label="Nakshatra" value={b.nakshatra} onChange={(e) => updateDetail('nakshatra', e.target.value)} />
                  <FormInput label="Manglik Status" value={b.manglik} onChange={(e) => updateDetail('manglik', e.target.value)} placeholder="No / Partial" />
                </div>
              )}

              {/* Tab 3: Career & Edu */}
              {activeTab === 'career' && (
                <div className="space-y-4">
                  <FormInput label="Education Summary" value={b.educationSummary} onChange={(e) => updateDetail('educationSummary', e.target.value)} />
                  <FormInput label="Occupation / Title" value={b.occupation} onChange={(e) => updateDetail('occupation', e.target.value)} />
                  <FormInput label="Annual Income" value={b.annualIncome} onChange={(e) => updateDetail('annualIncome', e.target.value)} />
                  <FormInput label="Work Location" value={b.workLocation} onChange={(e) => updateDetail('workLocation', e.target.value)} />
                  <FormInput label="Hobbies & Interests" value={b.hobbies} onChange={(e) => updateDetail('hobbies', e.target.value)} />
                </div>
              )}

              {/* Tab 4: Family */}
              {activeTab === 'family' && (
                <div className="space-y-4">
                  <FormInput label="Father's Name & Occupation" value={b.fatherName} onChange={(e) => updateDetail('fatherName', e.target.value)} />
                  <FormInput label="Mother's Name & Occupation" value={b.motherName} onChange={(e) => updateDetail('motherName', e.target.value)} />
                  <FormInput label="Brothers Details" value={b.brothers} onChange={(e) => updateDetail('brothers', e.target.value)} />
                  <FormInput label="Sisters Details" value={b.sisters} onChange={(e) => updateDetail('sisters', e.target.value)} />
                  <FormInput label="Native Place" value={b.nativePlace} onChange={(e) => updateDetail('nativePlace', e.target.value)} />
                  <FormTextarea label="Residential Address" value={b.residentialAddress} onChange={(e) => updateDetail('residentialAddress', e.target.value)} rows={2} />
                  <FormInput label="Contact Person & Phone" value={b.contactPerson} onChange={(e) => updateDetail('contactPerson', e.target.value)} />
                </div>
              )}
            </div>

            {/* Live Biodata Paper Preview (6 cols) */}
            <div className="lg:col-span-6 bg-neutral-100 dark:bg-neutral-900 p-4 rounded-3xl flex justify-center">
              <div id="biodata-paper" className="w-full bg-white text-neutral-900 p-8 rounded-2xl shadow-xl border-4 border-orange-200 space-y-5 text-xs">
                <div className="text-center border-b-2 border-brand-500 pb-3 space-y-1">
                  <span className="text-[10px] font-bold tracking-widest text-brand-600 uppercase">॥ श्री गणेशाय नमः ॥</span>
                  <h2 className="text-2xl font-bold font-heading text-neutral-900">{p.fullName || 'Full Name'}</h2>
                  <p className="text-neutral-500">{b.occupation}</p>
                </div>

                {p.photo && (
                  <div className="flex justify-center">
                    <img src={p.photo} alt={p.fullName} className="w-24 h-24 rounded-full object-cover border-2 border-brand-500" />
                  </div>
                )}

                {/* Personal Table */}
                <div className="space-y-1">
                  <h4 className="font-bold text-brand-700 bg-orange-50 p-1.5 rounded">Personal & Astrological Details</h4>
                  <div className="grid grid-cols-2 gap-1 pl-2 text-[11px]">
                    <div><strong>DOB:</strong> {b.dob}</div>
                    <div><strong>Time / Place:</strong> {b.timeOfBirth}, {b.placeOfBirth}</div>
                    <div><strong>Height:</strong> {b.height}</div>
                    <div><strong>Blood Group:</strong> {b.bloodGroup}</div>
                    <div><strong>Religion / Caste:</strong> {b.religion} - {b.caste}</div>
                    <div><strong>Rashi / Nakshatra:</strong> {b.rashi} / {b.nakshatra}</div>
                  </div>
                </div>

                {/* Career Table */}
                <div className="space-y-1">
                  <h4 className="font-bold text-brand-700 bg-orange-50 p-1.5 rounded">Education & Occupation</h4>
                  <div className="space-y-1 pl-2 text-[11px]">
                    <div><strong>Education:</strong> {b.educationSummary}</div>
                    <div><strong>Occupation:</strong> {b.occupation}</div>
                    <div><strong>Income:</strong> {b.annualIncome}</div>
                  </div>
                </div>

                {/* Family Table */}
                <div className="space-y-1">
                  <h4 className="font-bold text-brand-700 bg-orange-50 p-1.5 rounded">Family Details</h4>
                  <div className="space-y-1 pl-2 text-[11px]">
                    <div><strong>Father:</strong> {b.fatherName}</div>
                    <div><strong>Mother:</strong> {b.motherName}</div>
                    <div><strong>Siblings:</strong> {b.brothers} | {b.sisters}</div>
                    <div><strong>Native Place:</strong> {b.nativePlace}</div>
                    <div><strong>Contact:</strong> {b.contactPerson}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
