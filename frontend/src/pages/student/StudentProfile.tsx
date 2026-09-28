import React, { useState, useEffect } from 'react';
import { User, BookOpen, Landmark, FileCheck2, Edit3, Save, X, Sparkles, School, GraduationCap, Microscope, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export const StudentProfile: React.FC = () => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [completion, setCompletion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State with clean initial values (NO hardcoded fake student data)
  const [formData, setFormData] = useState({
    dob: '',
    gender: '',
    state: '',
    district: '',
    stCategory: '',
    subTribe: '',
    educationLevel: 'UNDERGRADUATE', // SCHOOL | DIPLOMA | UNDERGRADUATE | POSTGRADUATE | RESEARCH | PROFESSIONAL
    
    // School specific
    schoolName: '',
    classGrade: '',
    boardName: '',

    // College / University specific
    institutionName: '',
    courseName: '',
    degreeLevel: '',
    currentYear: '',
    semester: '',
    academicMarks: '',
    familyIncome: '',

    // Bank Details
    bankName: '',
    bankAccount: '',
    bankIfsc: '',

    // Research / Career
    researchArea: '',
    researchInterest: '',
    careerInterest: '',
  });

  const fetchProfileData = async () => {
    try {
      const [profRes, compRes] = await Promise.all([
        api.get('/students/me'),
        api.get('/students/me/profile-completion'),
      ]);

      if (profRes.data.success && profRes.data.profile) {
        const p = profRes.data.profile;
        setProfile(p);
        setFormData({
          dob: p.dob || '',
          gender: p.gender || '',
          state: p.state || '',
          district: p.district || '',
          stCategory: p.stCategory || '',
          subTribe: p.subTribe || '',
          educationLevel: p.educationLevel || 'UNDERGRADUATE',
          schoolName: p.schoolName || '',
          classGrade: p.classGrade || '',
          boardName: p.boardName || '',
          institutionName: p.institutionName || '',
          courseName: p.courseName || '',
          degreeLevel: p.degreeLevel || '',
          currentYear: p.currentYear !== null && p.currentYear !== undefined ? String(p.currentYear) : '',
          semester: p.semester !== null && p.semester !== undefined ? String(p.semester) : '',
          academicMarks: p.academicMarks !== null && p.academicMarks !== undefined ? String(p.academicMarks) : '',
          familyIncome: p.familyIncome !== null && p.familyIncome !== undefined ? String(p.familyIncome) : '',
          bankName: p.bankName || '',
          bankAccount: p.bankAccount || '',
          bankIfsc: p.bankIfsc || '',
          researchArea: p.researchArea || '',
          researchInterest: p.researchInterest || '',
          careerInterest: p.careerInterest || '',
        });
      }
      if (compRes.data.success) {
        setCompletion(compRes.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/students/me', formData);
      if (res.data.success) {
        setIsEditing(false);
        await fetchProfileData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const percentage = completion?.completionPercentage ?? 0;

  const renderValue = (val: any, suffix: string = '') => {
    if (val === null || val === undefined || val === '') {
      return <span className="text-muted-text italic">Not provided</span>;
    }
    return `${val}${suffix}`;
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs font-bold text-brand-maroon flex justify-center items-center gap-2">
        <Sparkles className="w-5 h-5 animate-spin text-gold" /> Loading Profile System...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Readiness Banner */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-maroon bg-maroon-50 px-3 py-1 rounded border border-maroon-200">
              SCHOLAR IDENTITY & ACADEMIC PROFILE
            </span>
            <h1 className="text-2xl font-serif font-black text-brand-dark">{t('myProfile')}</h1>
            <p className="text-xs text-muted-text">
              Adapts to your education stage: School, Vocational, UG, PG, Research or Professional.
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-brand-maroon hover:bg-brand-dark text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {/* Readiness Bar */}
        <div className="bg-ivory p-4 rounded-xl border border-border space-y-3">
          <div className="flex justify-between items-center text-xs">
            <h3 className="font-extrabold text-brand-dark flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-brand-maroon" /> Profile Completion & Readiness
            </h3>
            <span className="font-black text-brand-maroon bg-maroon-50 px-3 py-0.5 rounded-full border border-maroon-200">
              {percentage}% Complete
            </span>
          </div>

          <div className="w-full bg-border rounded-full h-3 overflow-hidden">
            <div
              className="bg-brand-maroon h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Incomplete Profile Alert Banner */}
        {percentage < 85 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Complete your profile to improve scholarship matching.</span>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-brand-maroon hover:bg-brand-dark text-white font-extrabold text-xs px-3.5 py-1.5 rounded-lg shadow-xs transition-all whitespace-nowrap"
              >
                Complete Profile
              </button>
            )}
          </div>
        )}
      </div>

      {/* Editing Form vs Read-Only View */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-border shadow-xs space-y-6">
          <h2 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider border-b border-border pb-2">
            {t('personalInformation')}
          </h2>

          {/* Education Level Selector */}
          <div className="space-y-1.5 bg-ivory p-4 rounded-xl border border-border">
            <label className="block font-extrabold text-xs text-brand-dark uppercase tracking-wider">
              {t('currentLevel')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { key: 'SCHOOL', label: t('school'), icon: School },
                { key: 'DIPLOMA', label: t('diploma'), icon: BookOpen },
                { key: 'UNDERGRADUATE', label: t('undergraduate'), icon: GraduationCap },
                { key: 'POSTGRADUATE', label: t('postgraduate'), icon: GraduationCap },
                { key: 'RESEARCH', label: t('research'), icon: Microscope },
                { key: 'PROFESSIONAL', label: t('professional'), icon: GraduationCap },
              ].map((lvl) => {
                const Icon = lvl.icon;
                const active = formData.educationLevel === lvl.key;
                return (
                  <button
                    key={lvl.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, educationLevel: lvl.key })}
                    className={`flex items-center gap-1.5 p-2 rounded-lg text-xs font-bold border transition-all ${
                      active
                        ? 'bg-brand-maroon text-white border-brand-maroon shadow-2xs'
                        : 'bg-white text-charcoal border-border hover:border-brand-maroon'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{lvl.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-charcoal mb-1">ST Category</label>
              <input
                type="text"
                placeholder="e.g. Scheduled Tribe"
                value={formData.stCategory}
                onChange={(e) => setFormData({ ...formData, stCategory: e.target.value })}
                className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Sub-Tribe</label>
              <input
                type="text"
                placeholder="e.g. Santhal / Gond / Bhil"
                value={formData.subTribe}
                onChange={(e) => setFormData({ ...formData, subTribe: e.target.value })}
                className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">State of Domicile</label>
              <input
                type="text"
                placeholder="e.g. Odisha / Jharkhand / MP"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">District</label>
              <input
                type="text"
                placeholder="e.g. Sundargarh"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">{t('annualFamilyIncome')}</label>
              <input
                type="number"
                placeholder="e.g. 180000"
                value={formData.familyIncome}
                onChange={(e) => setFormData({ ...formData, familyIncome: e.target.value })}
                className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">{t('academicPerformance')} (CGPA / %)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 8.5"
                value={formData.academicMarks}
                onChange={(e) => setFormData({ ...formData, academicMarks: e.target.value })}
                className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
              >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* CONDITIONAL EDUCATION FIELDS */}
          <div className="pt-4 border-t border-border space-y-4">
            <h3 className="font-serif font-extrabold text-sm text-brand-dark">
              {formData.educationLevel === 'SCHOOL' ? 'School Information' : 'Institutional Information'}
            </h3>

            {formData.educationLevel === 'SCHOOL' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-charcoal mb-1">{t('schoolName')}</label>
                  <input
                    type="text"
                    placeholder="Enter school name"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">{t('classGrade')}</label>
                  <select
                    value={formData.classGrade}
                    onChange={(e) => setFormData({ ...formData, classGrade: e.target.value })}
                    className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
                  >
                    <option value="">Select Class</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">{t('boardName')}</label>
                  <input
                    type="text"
                    placeholder="e.g. CBSE / State Board"
                    value={formData.boardName}
                    onChange={(e) => setFormData({ ...formData, boardName: e.target.value })}
                    className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-charcoal mb-1">{t('institutionName')}</label>
                  <input
                    type="text"
                    placeholder="Enter college / university name"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">{t('degreeCourse')}</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech Computer Science / B.Sc Chemistry"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">{t('yearSemester')}</label>
                  <input
                    type="number"
                    placeholder="e.g. 1, 2, 3, 4"
                    value={formData.currentYear}
                    onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                    className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
                  />
                </div>
              </div>
            )}

            {/* RESEARCH CONDITIONAL FIELDS */}
            {formData.educationLevel === 'RESEARCH' && (
              <div className="pt-3 border-t border-border space-y-3">
                <h4 className="font-extrabold text-xs text-brand-maroon uppercase tracking-wider">Research Proposal & Topic</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-charcoal mb-1">{t('researchArea')}</label>
                    <input
                      type="text"
                      value={formData.researchArea}
                      onChange={(e) => setFormData({ ...formData, researchArea: e.target.value })}
                      className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
                      placeholder="e.g. Tribal Ethnography / Indigenous AI Linguistics"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-charcoal mb-1">{t('researchInterestOptional')}</label>
                    <input
                      type="text"
                      value={formData.researchInterest}
                      onChange={(e) => setFormData({ ...formData, researchInterest: e.target.value })}
                      className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BANK ACCOUNT EDIT FIELDS */}
          <div className="pt-4 border-t border-border space-y-4 text-xs">
            <h3 className="font-serif font-extrabold text-sm text-brand-dark">Bank Account & DBT Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-charcoal mb-1">Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. State Bank of India"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-charcoal mb-1">Account Number</label>
                <input
                  type="text"
                  placeholder="Enter Bank Account Number"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-charcoal mb-1">IFSC Code</label>
                <input
                  type="text"
                  placeholder="e.g. SBIN0002110"
                  value={formData.bankIfsc}
                  onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value })}
                  className="w-full bg-ivory border border-border rounded-lg p-2.5 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-ivory text-charcoal font-bold text-xs px-4 py-2 rounded-xl border border-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-maroon hover:bg-brand-dark text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-gold" />
              {saving ? 'Saving...' : t('saveProfile')}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal & Tribal Info */}
          <div className="bg-white rounded-2xl p-6 border border-border shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-brand-dark flex items-center gap-2 border-b border-border pb-2">
              <User className="w-4 h-4 text-brand-maroon" /> {t('personalInformation')}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-text font-medium">Full Name:</span>
                <strong className="text-brand-dark font-bold">{renderValue(profile?.user?.name)}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-text font-medium">Email (Verified):</span>
                <strong className="text-brand-dark font-bold">{renderValue(profile?.user?.email)}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-text font-medium">Mobile Number:</span>
                <strong className="text-brand-dark font-bold">{renderValue(profile?.user?.mobile)}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-text font-medium">Date of Birth:</span>
                <strong className="text-brand-dark font-bold">{renderValue(profile?.dob)}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-text font-medium">Gender:</span>
                <strong className="text-brand-dark font-bold">{renderValue(profile?.gender)}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-text font-medium">Current Level:</span>
                <strong className="text-brand-maroon font-bold bg-maroon-50 px-2 py-0.5 rounded border border-maroon-100">
                  {renderValue(profile?.educationLevel)}
                </strong>
              </div>

              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-text font-medium">ST Category:</span>
                <strong className="text-brand-dark font-bold">{renderValue(profile?.stCategory)}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-text font-medium">Sub-Tribe:</span>
                <strong className="text-brand-dark font-bold">{renderValue(profile?.subTribe)}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-text font-medium">State of Domicile:</span>
                <strong className="text-brand-dark font-bold">{renderValue(profile?.state)}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-text font-medium">District:</span>
                <strong className="text-brand-dark font-bold">{renderValue(profile?.district)}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-text font-medium">{t('annualFamilyIncome')}:</span>
                <strong className="text-brand-dark font-bold">
                  {profile?.familyIncome !== null && profile?.familyIncome !== undefined && profile?.familyIncome !== ''
                    ? `₹${Number(profile.familyIncome).toLocaleString('en-IN')}`
                    : <span className="text-muted-text italic">Not provided</span>}
                </strong>
              </div>
            </div>
          </div>

          {/* Academic / School / College Profile */}
          <div className="bg-white rounded-2xl p-6 border border-border shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-brand-dark flex items-center gap-2 border-b border-border pb-2">
              <BookOpen className="w-4 h-4 text-brand-maroon" /> Education Level Record
            </h3>

            <div className="space-y-3 text-xs">
              {profile?.educationLevel === 'SCHOOL' ? (
                <>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-text font-medium">{t('schoolName')}:</span>
                    <strong className="text-brand-dark font-bold">{renderValue(profile?.schoolName)}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-text font-medium">{t('classGrade')}:</span>
                    <strong className="text-brand-dark font-bold">{renderValue(profile?.classGrade)}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-text font-medium">{t('boardName')}:</span>
                    <strong className="text-brand-dark font-bold">{renderValue(profile?.boardName)}</strong>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-text font-medium">{t('institutionName')}:</span>
                    <strong className="text-brand-dark font-bold">{renderValue(profile?.institutionName)}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-text font-medium">{t('degreeCourse')}:</span>
                    <strong className="text-brand-dark font-bold">{renderValue(profile?.courseName)}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-text font-medium">{t('yearSemester')}:</span>
                    <strong className="text-brand-dark font-bold">
                      {(profile?.currentYear || profile?.semester)
                        ? `Year ${profile?.currentYear || 'N/A'} (Sem ${profile?.semester || 'N/A'})`
                        : <span className="text-muted-text italic">Not provided</span>}
                    </strong>
                  </div>
                </>
              )}

              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-text font-medium">{t('academicPerformance')}:</span>
                <strong className="text-forest font-black">{renderValue(profile?.academicMarks, ' CGPA / %')}</strong>
              </div>

              {profile?.educationLevel === 'RESEARCH' && (
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-text font-medium">{t('researchArea')}:</span>
                  <strong className="text-brand-dark font-bold">{renderValue(profile?.researchArea)}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bank Account Linkage */}
      {profile?.bankAccount ? (
        <div className="bg-[#5B1720] text-white p-6 rounded-2xl border border-maroon-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold">DBT DIRECT BENEFIT TRANSFER LINKAGE</span>
            <h3 className="text-base font-serif font-extrabold flex items-center gap-2">
              <Landmark className="w-5 h-5 text-gold" /> {profile.bankName || 'Bank Account'} Ending in {profile.bankAccount.slice(-4)}
            </h3>
            <p className="text-xs text-cream/90">Aadhaar Seeded & Active • IFSC: {profile.bankIfsc || 'Verified'}</p>
          </div>

          <span className="bg-gold text-brand-dark font-extrabold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-brand-dark" /> Verified DBT Seeding
          </span>
        </div>
      ) : (
        <div className="bg-ivory text-brand-dark p-6 rounded-2xl border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-text">DBT DIRECT BENEFIT TRANSFER LINKAGE</span>
            <h3 className="text-base font-serif font-extrabold flex items-center gap-2">
              <Landmark className="w-5 h-5 text-brand-maroon" /> Bank Account Details
            </h3>
            <p className="text-xs text-muted-text">Not provided — Add bank details to enable direct scholarship disbursement.</p>
          </div>

          <span className="bg-maroon-50 text-brand-maroon font-bold text-xs px-3.5 py-1.5 rounded-full border border-maroon-200">
            Bank Details Pending
          </span>
        </div>
      )}
    </div>
  );
};
