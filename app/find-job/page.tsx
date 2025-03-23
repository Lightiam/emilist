"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaSortAmountDown, FaCalendarAlt, 
  FaDollarSign, FaToolbox, FaClock, FaBookmark, FaRegBookmark, FaCheckCircle, 
  FaSpinner, FaBriefcase, FaLightbulb, FaUsers } from 'react-icons/fa';
import './FindJob.css';

// AI-enhanced Find Jobs Page for Emilist
const FindJobPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobCategories, setJobCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [jobAnalysis, setJobAnalysis] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [budgetRange, setBudgetRange] = useState([0, 100000]);
  const [durationRange, setDurationRange] = useState([0, 180]);
  const [userSkills, setUserSkills] = useState([
    'Carpentry', 'Flooring', 'Tile Installation', 'Painting', 'Drywall'
  ]);
  
  // Fetch initial jobs data
  useEffect(() => {
    const fetchJobsData = async () => {
      try {
        // In production, this would be an actual API call
        // Using mock data for demonstration
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock jobs data
        const mockJobs = [
          {
            id: 'job1',
            title: 'Kitchen Renovation Project',
            description: 'Looking for an experienced contractor to renovate a kitchen in a single-family home. Project includes cabinet installation, countertop replacement, backsplash installation, and new appliance setup.',
            location: 'Portland, OR',
            category: 'Renovation',
            projectType: 'Residential',
            budget: 15000,
            postedDate: '2025-03-15',
            deadline: '2025-03-30',
            duration: 30, // days
            clientRating: 4.8,
            clientProjects: 7,
            requiredSkills: ['Cabinetry', 'Countertop Installation', 'Tile Work', 'Plumbing'],
            preferredStart: '2025-04-15',
            applicationCount: 12,
            verified: true,
            aiMatchScore: 42
          },
          {
            id: 'job2',
            title: 'Bathroom Remodel',
            description: 'Complete bathroom remodel including shower, tub, vanity, toilet, flooring, and lighting. All fixtures and materials will be provided. Looking for someone who can complete the job within 3 weeks.',
            location: 'Seattle, WA',
            category: 'Renovation',
            projectType: 'Residential',
            budget: 8500,
            postedDate: '2025-03-17',
            deadline: '2025-04-01',
            duration: 21, // days
            clientRating: 4.6,
            clientProjects: 3,
            requiredSkills: ['Plumbing', 'Tile Installation', 'Electrical', 'Flooring'],
            preferredStart: '2025-04-10',
            applicationCount: 8,
            verified: true,
            aiMatchScore: 87
          },
          {
            id: 'job3',
            title: 'Deck Construction',
            description: 'Need an experienced deck builder to construct a 400 sq ft composite deck with railing. Must have experience with Trex or similar composite decking materials. Project includes stairs and built-in seating.',
            location: 'Denver, CO',
            category: 'Construction',
            projectType: 'Residential',
            budget: 12000,
            postedDate: '2025-03-10',
            deadline: '2025-03-25',
            duration: 14, // days
            clientRating: 4.9,
            clientProjects: 2,
            requiredSkills: ['Carpentry', 'Deck Building', 'Foundation Work'],
            preferredStart: '2025-04-05',
            applicationCount: 15,
            verified: true,
            aiMatchScore: 93
          },
          {
            id: 'job4',
            title: 'Office Space Painting',
            description: 'Commercial office space (2,500 sq ft) needs painting. Walls only, no ceiling work required. Must be able to work evenings and weekends to avoid disrupting business operations.',
            location: 'Chicago, IL',
            category: 'Painting',
            projectType: 'Commercial',
            budget: 5500,
            postedDate: '2025-03-18',
            deadline: '2025-04-02',
            duration: 7, // days
            clientRating: 4.7,
            clientProjects: 11,
            requiredSkills: ['Painting', 'Commercial Experience'],
            preferredStart: '2025-04-08',
            applicationCount: 6,
            verified: true,
            aiMatchScore: 76
          },
          {
            id: 'job5',
            title: 'Basement Finishing',
            description: 'Unfinished basement (800 sq ft) needs to be converted into a recreation room and home office. Project includes framing, drywall, electrical, flooring, and painting. Bathroom plumbing already in place.',
            location: 'Minneapolis, MN',
            category: 'Renovation',
            projectType: 'Residential',
            budget: 25000,
            postedDate: '2025-03-12',
            deadline: '2025-03-27',
            duration: 45, // days
            clientRating: 4.5,
            clientProjects: 1,
            requiredSkills: ['Framing', 'Drywall', 'Electrical', 'Flooring', 'Painting'],
            preferredStart: '2025-04-20',
            applicationCount: 9,
            verified: false,
            aiMatchScore: 95
          },
          {
            id: 'job6',
            title: 'Retail Store Shelving Installation',
            description: 'New retail store needs custom shelving installed throughout the space (approximately 1,200 sq ft). Materials will be provided. Looking for precision and attention to detail.',
            location: 'Austin, TX',
            category: 'Installation',
            projectType: 'Commercial',
            budget: 7500,
            postedDate: '2025-03-16',
            deadline: '2025-03-31',
            duration: 10, // days
            clientRating: 4.4,
            clientProjects: 4,
            requiredSkills: ['Carpentry', 'Commercial Experience', 'Custom Shelving'],
            preferredStart: '2025-04-12',
            applicationCount: 4,
            verified: true,
            aiMatchScore: 61
          }
        ];
        
        // Extract unique categories and project types
        const categories = Array.from(new Set(mockJobs.map(job => job.category))).sort();
        const types = Array.from(new Set(mockJobs.map(job => job.projectType))).sort();
        
        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
        setJobCategories(categories);
        setProjectTypes(types);
      } catch (error) {
        console.error('Error fetching jobs data:', error);
      }
    };
    
    fetchJobsData();
  }, []);
  
  // Filter and sort jobs based on criteria
  useEffect(() => {
    if (jobs.length === 0) return;
    
    let results = [...jobs];
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.requiredSkills.some((skill: string) => skill.toLowerCase().includes(query))
      );
    }
    
    // Apply location filter
    if (location.trim()) {
      const locationQuery = location.toLowerCase();
      results = results.filter(job => 
        job.location.toLowerCase().includes(locationQuery)
      );
    }
    
    // Apply category filters
    if (selectedCategories.length > 0) {
      results = results.filter(job => 
        selectedCategories.includes(job.category)
      );
    }
    
    // Apply project type filters
    if (selectedProjectTypes.length > 0) {
      results = results.filter(job => 
        selectedProjectTypes.includes(job.projectType)
      );
    }
    
    // Apply budget range filter
    results = results.filter(job => 
      job.budget >= budgetRange[0] && job.budget <= budgetRange[1]
    );
    
    // Apply duration range filter
    results = results.filter(job => 
      job.duration >= durationRange[0] && job.duration <= durationRange[1]
    );
    
    // Apply sorting
    switch (sortBy) {
      case 'budget-high':
        results.sort((a, b) => b.budget - a.budget);
        break;
      case 'budget-low':
        results.sort((a, b) => a.budget - b.budget);
        break;
      case 'date-newest':
        results.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case 'date-oldest':
        results.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime());
        break;
      case 'duration-short':
        results.sort((a, b) => a.duration - b.duration);
        break;
      case 'duration-long':
        results.sort((a, b) => b.duration - a.duration);
        break;
      case 'match':
        results.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
        break;
      case 'relevance':
      default:
        // In a real app, this would use a relevance algorithm
        // For now, we'll just use the match score
        results.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
        break;
    }
    
    setFilteredJobs(results);
  }, [jobs, searchQuery, location, selectedCategories, selectedProjectTypes, sortBy, budgetRange, durationRange]);
  
  // Search for jobs
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSearching(true);
    
    try {
      // In a production environment, this would call your AI-powered search endpoint
      // For now, we'll use the filtering logic in the useEffect
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // The actual filtering is done in the useEffect
    } catch (error) {
      console.error('Error searching for jobs:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Toggle project type selection
  const toggleProjectType = (type: string) => {
    if (selectedProjectTypes.includes(type)) {
      setSelectedProjectTypes(selectedProjectTypes.filter(t => t !== type));
    } else {
      setSelectedProjectTypes([...selectedProjectTypes, type]);
    }
  };
  
  // Toggle job as saved
  const toggleSaveJob = (jobId: string) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };
  
  // Analyze job with AI
  const analyzeJob = async (job: any) => {
    setSelectedJob(job);
    
    try {
      // In production, this would call your Groq AI endpoint
      // Simulating for now
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock AI job analysis
      const mockAnalysis = {
        skillMatch: {
          matched: job.requiredSkills.filter((skill: string) => userSkills.includes(skill)),
          missing: job.requiredSkills.filter((skill: string) => !userSkills.includes(skill)),
          matchPercentage: Math.round((job.requiredSkills.filter((skill: string) => userSkills.includes(skill)).length / job.requiredSkills.length) * 100)
        },
        competitionAnalysis: {
          applicantCount: job.applicationCount,
          competitionLevel: job.applicationCount > 10 ? 'High' : job.applicationCount > 5 ? 'Moderate' : 'Low',
          recommendedApproach: job.applicationCount > 10 ? 
            'Highlight your unique skills and experience with similar projects' : 
            'Emphasize your availability and interest in the specific project details'
        },
        budgetAnalysis: {
          fairnessAssessment: job.budget > 20000 ? 'Above market rate' : 
                            job.budget > 10000 ? 'Fair market rate' : 
                            job.budget > 5000 ? 'Slightly below market rate' : 'Below market rate',
          hourlyEquivalent: `$${Math.round(job.budget / (job.duration * 8))} per hour (assuming 8-hour days)`
        },
        timelineAssessment: {
          feasibility: job.duration > 30 ? 'Comfortable timeline' : 
                       job.duration > 14 ? 'Typical timeline' : 'Tight timeline',
          recommendation: job.duration < 14 ? 'Confirm you can meet this deadline before applying' : 'Timeline appears reasonable for the scope'
        },
        clientInsight: {
          reliability: job.clientRating > 4.7 ? 'Highly reliable' : 
                       job.clientRating > 4.3 ? 'Generally reliable' : 'Average reliability',
          experienceLevel: job.clientProjects > 5 ? 'Experienced client' : 'Newer client',
          paymentHistory: job.clientRating > 4.5 ? 'Excellent payment history' : 'Standard payment history'
        },
        overallRecommendation: job.aiMatchScore > 80 ? 'Strong match - apply with confidence' : 
                               job.aiMatchScore > 60 ? 'Good match - focus on relevant experience' : 
                               job.aiMatchScore > 40 ? 'Potential match - highlight transferable skills' : 
                               'Consider other opportunities with better skill alignment'
      };
      
      setJobAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Error analyzing job:', error);
    }
  };
  
  // Apply to job
  const applyToJob = (jobId: string) => {
    // In production, this would navigate to an application form
    alert(`Applying to job ${jobId}`);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options as any);
  };
  
  // Format time period
  const formatDuration = (days: number) => {
    if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (days < 30) {
      const weeks = Math.round(days / 7);
      return `${weeks} week${weeks !== 1 ? 's' : ''}`;
    } else {
      const months = Math.round(days / 30);
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
  };
  
  // Days since posting
  const daysSincePosting = (dateString: string) => {
    const posted = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };
  
  return (
    <div className="find-job-page">
      <h1>Find Jobs</h1>
      <p className="page-description">
        Discover projects that match your skills and receive AI-powered insights on job opportunities.
      </p>
      
      {/* Search Form */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs by title, skills, or keywords..."
                className="search-input"
              />
            </div>
            
            <div className="location-input-wrapper">
              <FaMapMarkerAlt className="location-icon" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (city, state, or ZIP)"
                className="location-input"
              />
            </div>
            
            <button 
              type="submit" 
              className="search-button"
              disabled={isSearching}
            >
              {isSearching ? <FaSpinner className="spinner" /> : <FaSearch />}
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Results Controls */}
      <div className="results-controls">
        <button 
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        <div className="sort-control">
          <label><FaSortAmountDown /> Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance">Most Relevant</option>
            <option value="match">Best Match</option>
            <option value="date-newest">Newest First</option>
            <option value="date-oldest">Oldest First</option>
            <option value="budget-high">Budget: High to Low</option>
            <option value="budget-low">Budget: Low to High</option>
            <option value="duration-short">Duration: Shortest First</option>
            <option value="duration-long">Duration: Longest First</option>
          </select>
        </div>
        
        <div className="results-count">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </div>
      </div>
      
      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-section">
            <h3>Job Categories</h3>
            <div className="categories-list">
              {jobCategories.map(category => (
                <label className="category-item" key={category}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="filter-section">
            <h3>Project Types</h3>
            <div className="project-types-list">
              {projectTypes.map(type => (
                <label className="project-type-item" key={type}>
                  <input
                    type="checkbox"
                    checked={selectedProjectTypes.includes(type)}
                    onChange={() => toggleProjectType(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="filter-section">
            <h3>Budget Range</h3>
            <div className="budget-range-slider">
              <div className="range-labels">
                <span>${budgetRange[0].toLocaleString()}</span>
                <span>${budgetRange[1].toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={budgetRange[0]}
                onChange={(e) => setBudgetRange([parseInt(e.target.value, 10), budgetRange[1]])}
              />
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={budgetRange[1]}
                onChange={(e) => setBudgetRange([budgetRange[0], parseInt(e.target.value, 10)])}
              />
            </div>
          </div>
          
          <div className="filter-section">
            <h3>Project Duration</h3>
            <div className="duration-range-slider">
              <div className="range-labels">
                <span>{formatDuration(durationRange[0])}</span>
                <span>{formatDuration(durationRange[1])}</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="7"
                value={durationRange[0]}
                onChange={(e) => setDurationRange([parseInt(e.target.value, 10), durationRange[1]])}
              />
              <input
                type="range"
                min="0"
                max="180"
                step="7"
                value={durationRange[1]}
                onChange={(e) => setDurationRange([durationRange[0], parseInt(e.target.value, 10)])}
              />
            </div>
          </div>
          
          <button className="clear-filters-btn" onClick={() => {
            setSelectedCategories([]);
            setSelectedProjectTypes([]);
            setBudgetRange([0, 100000]);
            setDurationRange([0, 180]);
          }}>
            Clear All Filters
          </button>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="job-content-area">
        {/* Jobs List */}
        <div className="jobs-list">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div 
                className={`job-card ${selectedJob?.id === job.id ? 'selected' : ''}`} 
                key={job.id}
                onClick={() => analyzeJob(job)}
              >
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <button 
                    className="save-job-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveJob(job.id);
                    }}
                  >
                    {savedJobs.includes(job.id) ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                </div>
                
                <div className="job-location">
                  <FaMapMarkerAlt />
                  <span>{job.location}</span>
                </div>
                
                <div className="job-meta">
                  <div className="job-category">
                    <FaBriefcase />
                    <span>{job.category}</span>
                  </div>
                  <div className="job-type">
                    <FaToolbox />
                    <span>{job.projectType}</span>
                  </div>
                  <div className="job-date">
                    <FaCalendarAlt />
                    <span>{daysSincePosting(job.postedDate)}</span>
                  </div>
                </div>
                
                <p className="job-description">{job.description.substring(0, 150)}...</p>
                
                <div className="job-details">
                  <div className="job-budget">
                    <FaDollarSign />
                    <span>${job.budget.toLocaleString()}</span>
                  </div>
                  <div className="job-duration">
                    <FaClock />
                    <span>{formatDuration(job.duration)}</span>
                  </div>
                </div>
                
                <div className="job-skills">
                  <h4>Required Skills:</h4>
                  <div className="skills-list">
                    {job.requiredSkills.map((skill: string, index: number) => (
                      <span 
                        key={index} 
                        className={`skill-tag ${userSkills.includes(skill) ? 'matched' : ''}`}
                      >
                        {userSkills.includes(skill) && <FaCheckCircle className="match-icon" />}
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {job.verified && (
                  <div className="verified-client">
                    <FaCheckCircle />
                    <span>Verified Client</span>
                  </div>
                )}
                
                <div className="job-match-score">
                  <div className="match-label">AI Match Score</div>
                  <div className="match-bar">
                    <div 
                      className="match-fill" 
                      style={{ width: `${job.aiMatchScore}%` }}
                    ></div>
                    <span className="match-value">{job.aiMatchScore}%</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-jobs-found">
              <h3>No jobs match your search criteria</h3>
              <p>Try adjusting your filters or search terms to find more opportunities.</p>
            </div>
          )}
        </div>
        
        {/* Job Analysis Panel */}
        {selectedJob && jobAnalysis && (
          <div className="job-analysis-panel">
            <div className="panel-header">
              <h2>AI Job Analysis</h2>
              <p className="job-title">{selectedJob.title}</p>
            </div>
            
            <div className="analysis-content">
              <div className="analysis-section">
                <h3><FaToolbox /> Skill Match</h3>
                <div className="skill-match">
                  <div className="match-percentage">{jobAnalysis.skillMatch.matchPercentage}%</div>
                  <div className="match-bar">
                    <div 
                      className="match-fill" 
                      style={{ width: `${jobAnalysis.skillMatch.matchPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="matched-skills">
                  <h4>Skills You Have:</h4>
                  <div className="skills-list">
                    {jobAnalysis.skillMatch.matched.map((skill: string, index: number) => (
                      <span key={index} className="skill-tag matched">
                        <FaCheckCircle className="match-icon" /> {skill}
                      </span>
                    ))}
                    {jobAnalysis.skillMatch.matched.length === 0 && (
                      <span className="no-skills">No matched skills</span>
                    )}
                  </div>
                </div>
                
                <div className="missing-skills">
                  <h4>Skills You're Missing:</h4>
                  <div className="skills-list">
                    {jobAnalysis.skillMatch.missing.map((skill: string, index: number) => (
                      <span key={index} className="skill-tag missing">
                        {skill}
                      </span>
                    ))}
                    {jobAnalysis.skillMatch.missing.length === 0 && (
                      <span className="no-skills">You have all required skills!</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="analysis-section">
                <h3><FaUsers /> Competition Analysis</h3>
                <p><strong>Applicants:</strong> {jobAnalysis.competitionAnalysis.applicantCount}</p>
                <p><strong>Competition Level:</strong> {jobAnalysis.competitionAnalysis.competitionLevel}</p>
                <div className="analysis-tip">
                  <FaLightbulb className="tip-icon" />
                  <p>{jobAnalysis.competitionAnalysis.recommendedApproach}</p>
                </div>
              </div>
              
              <div className="analysis-section">
                <h3><FaDollarSign /> Budget Analysis</h3>
                <p><strong>Assessment:</strong> {jobAnalysis.budgetAnalysis.fairnessAssessment}</p>
                <p><strong>Hourly Equivalent:</strong> {jobAnalysis.budgetAnalysis.hourlyEquivalent}</p>
              </div>
              
              <div className="analysis-section">
                <h3><FaCalendarAlt /> Timeline Assessment</h3>
                <p><strong>Feasibility:</strong> {jobAnalysis.timelineAssessment.feasibility}</p>
                <div className="analysis-tip">
                  <FaLightbulb className="tip-icon" />
                  <p>{jobAnalysis.timelineAssessment.recommendation}</p>
                </div>
              </div>
              
              <div className="analysis-section">
                <h3><FaCheckCircle /> Client Insight</h3>
                <p><strong>Reliability:</strong> {jobAnalysis.clientInsight.reliability}</p>
                <p><strong>Experience:</strong> {jobAnalysis.clientInsight.experienceLevel}</p>
                <p><strong>Payment History:</strong> {jobAnalysis.clientInsight.paymentHistory}</p>
              </div>
              
              <div className="overall-recommendation">
                <h3>AI Recommendation</h3>
                <p>{jobAnalysis.overallRecommendation}</p>
              </div>
              
              <div className="job-actions">
                <button 
                  className="apply-btn primary-btn" 
                  onClick={() => applyToJob(selectedJob.id)}
                >
                  Apply to This Job
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindJobPage;
