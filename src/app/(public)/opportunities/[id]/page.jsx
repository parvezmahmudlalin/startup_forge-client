import React from "react";
import Link from "next/link";
import {
  FaBriefcase,
  FaClock,
  FaCalendarAlt,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

export default async function OpportunitiesDetailsPage({ params }) {
  
  const { id } = await params;
  console.log("Opportunity ID:", id);

  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/opportunities/${id}`,
    {
      cache: "no-store",
    }
  );

  
  if (!res.ok) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-2">
          Opportunity Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The opportunity you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/dashboard/collaborator/opportunities"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Back to Opportunities
        </Link>
      </div>
    );
  }

  const opportunity = await res.json();

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Link
          href="/dashboard/collaborator/opportunities"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          <FaArrowLeft /> Back to Opportunities
        </Link>

        {/* Main Details Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <FaBriefcase /> {opportunity.work_type}
                </span>
                {opportunity.commitment_level && (
                  <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <FaClock /> {opportunity.commitment_level}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {opportunity.role_title}
              </h1>
            </div>

            <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]">
              Apply Now
            </button>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <FaBriefcase className="text-xl" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Work Type</p>
                <p className="text-base font-semibold text-gray-800">
                  {opportunity.work_type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                <FaCalendarAlt className="text-xl" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Deadline</p>
                <p className="text-base font-semibold text-gray-800">
                  {opportunity.deadline
                    ? new Date(opportunity.deadline).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-blue-600" /> Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {opportunity.required_skills?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-slate-100 border border-slate-200 text-slate-700 font-medium px-4 py-1.5 rounded-lg text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}