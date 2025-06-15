import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronRight, Upload, UserCircle, Briefcase, GraduationCap, Wrench, FileText, Plus, Award, CheckCircle } from "lucide-react";

const CreatePage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
    skills: "",
    education: [
      {
        institution: "",
        degree: "10th",
        field: "",
        startDate: "",
        endDate: "",
        marks: "",
        grade: "",
        isCurrentlyStudying: false
      }
    ],
    workExperience: [{
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrentlyWorking: false,
      description: "",
      responsibilities: [],
      achievements: [],
      skills: []
    }],
    resume: null,
    extractedResumeText: "",
    isFresher: true,
  });

  const [newResponsibility, setNewResponsibility] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [newExperienceSkill, setNewExperienceSkill] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  const handleChange = (e, index, field, type) => {
    if (type === "education") {
      const updatedEducation = [...formData.education];
      updatedEducation[index][field] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData({ ...formData, education: updatedEducation });
    } else if (type === "workExperience") {
      const updatedExperience = [...formData.workExperience];
      updatedExperience[index][field] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData({ ...formData, workExperience: updatedExperience });
    } else if (e.target.name === "isFresher") {
      const isFresher = e.target.value === "fresher";
      setFormData({ 
        ...formData, 
        isFresher: isFresher,
        workExperience: isFresher ? [] : [{
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          isCurrentlyWorking: false,
          description: "",
          responsibilities: [],
          achievements: [],
          skills: []
        }]
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, {
        institution: "",
        degree: "10th",
        field: "",
        startDate: "",
        endDate: "",
        marks: "",
        grade: "",
        isCurrentlyStudying: false
      }],
    });
  };

  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [...formData.workExperience, { company: "", title: "", years: "" }],
    });
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    
    if (step < 5) {
      setStep(step + 1);
    } else {
      try {
        // Process skills array
        const processedSkills = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);

        // Process education data
        const processedEducation = formData.education.map(edu => ({
          ...edu,
          startDate: new Date(edu.startDate),
          endDate: edu.isCurrentlyStudying ? null : new Date(edu.endDate)
        }));

        // Process work experience data
        const processedWorkExperience = formData.workExperience.map(exp => ({
          ...exp,
          startDate: new Date(exp.startDate),
          endDate: exp.isCurrentlyWorking ? null : new Date(exp.endDate)
        }));

        // Prepare the data to be sent
        const profileData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          location: formData.location,
          skills: processedSkills,
          education: processedEducation,
          workExperience: processedWorkExperience,
          isFresher: formData.isFresher,
          resume: formData.resume || null,
          extractedResumeText: formData.extractedResumeText || null
        };

        console.log('Submitting profile data:', profileData); // For debugging

        const response = await axios.post('http://localhost:5000/api/submit-profile', profileData);

        if (response.status === 201) {
          alert('Profile submitted successfully!');
          // Redirect to dashboard or home page
          window.location.href = '/jobseeker/jobseeker-profile';
        }
      } catch (error) {
        console.error('Error submitting profile:', error);
        // Show more detailed error message to user
        const errorMessage = error.response?.data?.message || error.message || 'Failed to submit profile. Please try again.';
        alert(errorMessage);
      }
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, PNG, or JPG file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size should be less than 5MB');
      return;
    }

    try {
      // First, upload the resume file
      const formDataWithFile = new FormData();
      formDataWithFile.append("resume", file);

      // Upload resume file
      const uploadResponse = await axios.post("http://localhost:5000/api/upload-resume", formDataWithFile, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!uploadResponse.data || !uploadResponse.data.filePath) {
        throw new Error('Failed to upload resume');
      }

      // Then, send the resume to the text extraction API
      const extractResponse = await axios.post("http://127.0.0.1:5000/extract_text", formDataWithFile, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (extractResponse.data && extractResponse.data.extracted_text) {
        // Update form data with both resume path and extracted text
        setFormData(prev => ({
          ...prev,
          resume: uploadResponse.data.filePath,
          extractedResumeText: extractResponse.data.extracted_text
        }));

        // Show success message
        alert('Resume uploaded and processed successfully!');
      } else {
        throw new Error('Failed to extract text from resume');
      }
    } catch (error) {
      console.error("Error processing resume:", error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to process resume. Please try again.';
      alert(errorMessage);
    }
  };

  const StepIndicator = ({ currentStep }) => {
    const steps = [
      { icon: UserCircle, label: "Personal" },
      { icon: Wrench, label: "Skills" },
      { icon: GraduationCap, label: "Education" },
      { icon: Briefcase, label: "Experience" },
      { icon: FileText, label: "Resume" },
    ];

    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i + 1 === currentStep;
            const isCompleted = i + 1 < currentStep;
            return (
              <div key={i} className="flex flex-col items-center group">
                <div 
                  className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isActive ? 'bg-blue-600 text-white scale-110' :
                    isCompleted ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <span className={`mt-2 text-xs md:text-sm transition-colors duration-200 ${
                  isActive ? 'text-blue-600 font-semibold' :
                  isCompleted ? 'text-green-500' :
                  'text-gray-500'
                }`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`hidden md:block absolute h-0.5 w-8 lg:w-16 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} style={{ left: '100%', top: '50%' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400";
  const buttonClasses = "flex items-center justify-center w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium";
  const secondaryButtonClasses = "flex items-center justify-center px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Create Your Profile</h1>
          <p className="text-gray-600">Complete all steps to create your professional profile</p>
        </div>
        
        <StepIndicator currentStep={step} />
        
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 lg:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {step === 1 && "Personal Information"}
            {step === 2 && "Professional Skills"}
            {step === 3 && "Educational Background"}
            {step === 4 && "Work Experience"}
            {step === 5 && "Resume Upload"}
          </h2>

          <form onSubmit={handleNextStep} className="space-y-8">
            {step === 1 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className={inputClasses}
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className={inputClasses}
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    className={`${inputClasses} bg-gray-50 cursor-not-allowed`}
                    value={formData.email}
                    readOnly
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className={inputClasses}
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    className={inputClasses}
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Professional Skills</label>
                <p className="text-sm text-gray-500 mb-4">List your key skills, separated by commas (e.g., JavaScript, React, Node.js)</p>
                <textarea
                  name="skills"
                  rows={6}
                  className={`${inputClasses} resize-none`}
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Enter your skills..."
                  required
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {formData.education.map((edu, index) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-xl space-y-4 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Education #{index + 1}</h3>
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Institution</label>
                        <input
                          type="text"
                          className={inputClasses}
                          value={edu.institution}
                          onChange={(e) => handleChange(e, index, "institution", "education")}
                          placeholder="Enter institution name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Degree Level</label>
                        <select
                          className={inputClasses}
                          value={edu.degree}
                          onChange={(e) => handleChange(e, index, "degree", "education")}
                          required
                        >
                          <option value="10th">10th Standard</option>
                          <option value="Intermediate">Intermediate (12th)</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Bachelor">Bachelor's Degree</option>
                          <option value="Master">Master's Degree</option>
                          <option value="PhD">PhD</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                        <input
                          type="text"
                          className={inputClasses}
                          value={edu.field}
                          onChange={(e) => handleChange(e, index, "field", "education")}
                          placeholder="Enter field of study"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                          type="date"
                          className={inputClasses}
                          value={edu.startDate}
                          onChange={(e) => handleChange(e, index, "startDate", "education")}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                          type="date"
                          className={inputClasses}
                          value={edu.endDate}
                          onChange={(e) => handleChange(e, index, "endDate", "education")}
                          disabled={edu.isCurrentlyStudying}
                          required={!edu.isCurrentlyStudying}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Marks/GPA</label>
                        <input
                          type="text"
                          className={inputClasses}
                          value={edu.marks}
                          onChange={(e) => handleChange(e, index, "marks", "education")}
                          placeholder="Enter marks or GPA"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Grade</label>
                        <select
                          className={inputClasses}
                          value={edu.grade}
                          onChange={(e) => handleChange(e, index, "grade", "education")}
                          required
                        >
                          <option value="">Select Grade</option>
                          <option value="A+">A+</option>
                          <option value="A">A</option>
                          <option value="B+">B+</option>
                          <option value="B">B</option>
                          <option value="C+">C+</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="F">F</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`currentlyStudying-${index}`}
                          checked={edu.isCurrentlyStudying}
                          onChange={(e) => handleChange(e, index, "isCurrentlyStudying", "education")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`currentlyStudying-${index}`} className="text-sm text-gray-700">
                          Currently Studying
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEducation}
                  className={`${secondaryButtonClasses} w-full md:w-auto`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Education
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                {/* Experience Type Selection */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Experience Type</h3>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="isFresher"
                          value="fresher"
                          checked={formData.isFresher}
                          onChange={(e) => handleChange(e)}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Fresher</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="isFresher"
                          value="experienced"
                          checked={!formData.isFresher}
                          onChange={(e) => handleChange(e)}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Experienced</span>
                      </label>
                    </div>
                  </div>

                  {formData.isFresher ? (
                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <Award className="h-8 w-8 text-green-500 mr-3" />
                        <h4 className="text-xl font-medium text-gray-900">Fresher Profile</h4>
                      </div>
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          You are creating a fresher profile. This means you are ready to start your professional journey 
                          and bring fresh perspectives to the workplace.
                        </p>
                        <div className="bg-white p-4 rounded-lg border border-green-200">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Key Points for Freshers:</h5>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Focus on your educational background and academic achievements
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Highlight your relevant skills and certifications
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Emphasize your enthusiasm and willingness to learn
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.workExperience.map((exp, index) => (
                        <div key={index} className="p-6 bg-gray-50 rounded-xl space-y-4 transition-all duration-200 hover:shadow-md">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Experience #{index + 1}</h3>
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Briefcase className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Company</label>
                              <input
                                type="text"
                                className={inputClasses}
                                value={exp.company}
                                onChange={(e) => handleChange(e, index, "company", "workExperience")}
                                placeholder="Enter company name"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Position</label>
                              <input
                                type="text"
                                className={inputClasses}
                                value={exp.position}
                                onChange={(e) => handleChange(e, index, "position", "workExperience")}
                                placeholder="Enter position"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Start Date</label>
                              <input
                                type="date"
                                className={inputClasses}
                                value={exp.startDate}
                                onChange={(e) => handleChange(e, index, "startDate", "workExperience")}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">End Date</label>
                              <input
                                type="date"
                                className={inputClasses}
                                value={exp.endDate}
                                onChange={(e) => handleChange(e, index, "endDate", "workExperience")}
                                disabled={exp.isCurrentlyWorking}
                                required={!exp.isCurrentlyWorking}
                              />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Description</label>
                              <textarea
                                className={`${inputClasses} resize-none`}
                                value={exp.description}
                                onChange={(e) => handleChange(e, index, "description", "workExperience")}
                                placeholder="Enter job description"
                                rows={3}
                                required
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`currentlyWorking-${index}`}
                                checked={exp.isCurrentlyWorking}
                                onChange={(e) => handleChange(e, index, "isCurrentlyWorking", "workExperience")}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`currentlyWorking-${index}`} className="text-sm text-gray-700">
                                Currently Working
                              </label>
                            </div>
                          </div>

                          {/* Responsibilities */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                className={inputClasses}
                                value={newResponsibility}
                                onChange={(e) => setNewResponsibility(e.target.value)}
                                placeholder="Add responsibility"
                              />
                              <button
                                type="button"
                                onClick={() => addResponsibility(index)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Add
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {exp.responsibilities.map((resp, respIndex) => (
                                <span
                                  key={respIndex}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                >
                                  {resp}
                                  <button
                                    type="button"
                                    onClick={() => removeResponsibility(index, respIndex)}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Achievements */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Achievements</label>
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                className={inputClasses}
                                value={newAchievement}
                                onChange={(e) => setNewAchievement(e.target.value)}
                                placeholder="Add achievement"
                              />
                              <button
                                type="button"
                                onClick={() => addAchievement(index)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Add
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {exp.achievements.map((ach, achIndex) => (
                                <span
                                  key={achIndex}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                                >
                                  {ach}
                                  <button
                                    type="button"
                                    onClick={() => removeAchievement(index, achIndex)}
                                    className="ml-2 text-green-600 hover:text-green-800"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Skills</label>
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                className={inputClasses}
                                value={newExperienceSkill}
                                onChange={(e) => setNewExperienceSkill(e.target.value)}
                                placeholder="Add skill"
                              />
                              <button
                                type="button"
                                onClick={() => addExperienceSkill(index)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Add
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {exp.skills.map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                                >
                                  {skill}
                                  <button
                                    type="button"
                                    onClick={() => removeExperienceSkill(index, skillIndex)}
                                    className="ml-2 text-purple-600 hover:text-purple-800"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addWorkExperience}
                        className={`${secondaryButtonClasses} w-full md:w-auto`}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Experience
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl transition-all duration-200 hover:border-blue-400">
                <div className="space-y-4 text-center">
                  <div className="mx-auto h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center">
                    <Upload className="h-10 w-10 text-blue-500" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="resume" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload your resume</span>
                      <input
                        id="resume"
                        name="resume"
                        type="file"
                        className="sr-only"
                        onChange={handleResumeUpload}
                        accept=".pdf"
                        required
                      />
                    </label>
                    <p className="text-sm text-gray-500">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF up to 10MB</p>
                </div>
              </div>
            )}

            <button type="submit" className={buttonClasses}>
              <span className="mr-2">{step < 5 ? "Continue to Next Step" : "Complete Profile"}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;