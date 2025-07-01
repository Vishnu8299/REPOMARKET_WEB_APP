import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, DollarSign, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobDetail {
  id: string;
  type: string;
  title: string;
  company: string;
  location: string;
  deadline: string;
  description: string;
  tags: string[];
  logo?: string;
  url: string;
  salary?: string;
}

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [jobHtml, setJobHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamic: Try to get job from location.state, else fetch by id if needed
    if (location.state && location.state.job) {
      setJob(location.state.job);
      if (
        location.state.job.description &&
        /<\/?[a-z][\s\S]*>/i.test(location.state.job.description)
      ) {
        setJobHtml(location.state.job.description);
      }
      setLoading(false);
    } else if (id) {
      // Example for dynamic fetch: (uncomment and implement if you have a backend)
      /*
      fetch(`/api/jobs/${id}`)
        .then(res => res.json())
        .then(data => {
          setJob(data);
          if (data.description && /<\/?[a-z][\s\S]*>/i.test(data.description)) {
            setJobHtml(data.description);
          }
        })
        .catch(() => setJob(null))
        .finally(() => setLoading(false));
      */
      setLoading(false);
      setJob(null);
    } else {
      setLoading(false);
      setJob(null);
    }
  }, [location.state, id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4" />
        <span className="text-gray-500">Loading job details...</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Job not found.</p>
        <Button onClick={() => navigate("/developer/opportunities")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Opportunities
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-blue-200"
            onClick={() => navigate("/developer/opportunities")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <img
            src={
              job.logo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}`
            }
            alt={job.company}
            className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow bg-white"
          />
          <div>
            <div className="text-2xl font-bold text-blue-900">{job.title}</div>
            <div className="text-gray-600 font-medium">{job.company}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-500">
            <Building className="w-4 h-4" />
            {job.company}
          </div>
          {job.location && (
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-2 text-gray-500">
              <DollarSign className="w-4 h-4" />
              {job.salary}
            </div>
          )}
          {job.deadline && (
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date(job.deadline).toLocaleDateString()}
            </div>
          )}
        </div>
        <div className="mb-6">
          <div className="font-semibold text-blue-700 mb-2">Description</div>
          {jobHtml ? (
            <div
              className="text-gray-700 whitespace-pre-line prose max-w-none"
              dangerouslySetInnerHTML={{ __html: jobHtml }}
            />
          ) : (
            <div className="text-gray-700 whitespace-pre-line">
              {job.description || "No description provided."}
            </div>
          )}
        </div>
        {job.tags && job.tags.length > 0 && (
          <div className="mb-6">
            <div className="font-semibold text-blue-700 mb-2">Tags</div>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-full font-semibold"
            onClick={() => window.open(job.url, "_blank")}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
