import React, { useState, useEffect } from 'react';
import { FaDownload, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";

const ExamHallTicket = () => {
  const [showDialog, setShowDialog] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const [logoBase64, setLogoBase64] = useState("");
  const [profile, setProfile] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchLogoAsBase64 = async () => {
      try {
        const response = await fetch("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1ddQgEso4ID8fIfgj3acnG8gpnEoprXo2WgAFTTQ8HRxM9PnPpIq0m3ACg3zgdjMTj9A"); 
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          setLogoBase64(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    const fetchProfileAsBase64 = async () => {
      try {
        const response = await fetch("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKCqcLx-xr7e-tXER0kMHePCSEc4kNfUAAbg&s"); 
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          setProfile(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchProfileAsBase64();
    fetchLogoAsBase64();
  }, []);

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    const dob = e.target.dob.value;

    try {
      // Sample verification logic
      if (email === 'neerajsurnis@gmail.com' && dob === '2004-01-04') {
        // Mock student data
        const sampleData = {
          serialNo: '2024-NS-123',
          hallTicketNo: '24EXAM1',
          registrationNo: 'REG2024001',
          name: 'Neeraj Surnis',
          course: 'B.Tech Computer Science',
          testCenter: 'DKTE College',
          testDate: '2024-01-15',
          reportingTime: '09:00 AM',
          examTime: '10:00 AM - 01:00 PM',
          roomNo: '301',
          seatNo: 'A-123'
        };
        setStudentData(sampleData);
        setShowDialog(false);
        toast.success('Verification successful!');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('hall-ticket');
    const opts = {
      filename: `hall-ticket-${studentData.hallTicketNo}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    toast.promise(
      html2pdf().set(opts).from(element).save(),
      {
        loading: 'Generating PDF...',
        success: 'Hall ticket downloaded successfully!',
        error: 'Failed to download hall ticket'
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      {/* Verification Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96 relative">
            <IoMdClose
              className="absolute top-4 right-4 text-gray-600 text-2xl cursor-pointer hover:text-gray-800"
              onClick={() => navigate('/')}
              title="Close"
            />
            <h2 className="text-xl font-bold mb-4 text-gray-800">View Hall Ticket</h2>
            
            <form onSubmit={handleVerification}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400"
                >
                  {loading ? 'Verifying...' : 'View Hall Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Dialog */}
      

      {/* Hall Ticket Content */}
      <div className={`pt-28 pb-8 px-4 ${showDialog || showLogoutDialog ? 'blur-sm' : ''}`}>
        {studentData && (
          <div className="relative flex items-center justify-center">
            {/* Verification Icon */}
            <button
              onClick={() => setShowDialog(true)}
              className="fixed top-[9rem] right-8 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg"
              title="Verify Hall Ticket"
            >
              <FaSignInAlt size={20} />
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownloadPDF}
              className="fixed top-24 right-8 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg"
              title="Download Hall Ticket"
            >
              <FaDownload size={20} />
            </button>

            {/* Logout Button */}
            {isLoggedIn && (
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="fixed top-32 right-8 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg"
                title="Logout"
              >
                <FaSignOutAlt size={20} />
              </button>
            )}

            <div id="hall-ticket" className="w-[800px] p-8 bg-white rounded-lg shadow-lg relative">
              {/* Serial Number */}
              <div className="absolute top-4 right-4">
                <p className="text-xs text-gray-600">Serial No: {studentData.serialNo}</p>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-gray-200 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <img 
                      src={ logoBase64}
                      alt="College Logo" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">DKTE COLLEGE</h1>
                    <p className="text-sm text-gray-600">Established 1990</p>
                    <p className="text-xs text-gray-500">DKTE COLLEGE ENTRANCE TEST</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-red-600">HALL TICKET</h2>
                  <p className="text-sm text-gray-600">Academic Year 2024-25</p>
                  <p className="text-xs text-gray-500">Entrance Examination</p>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="col-span-2">
                  {/* Student Details */}
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b">Student Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <p className="text-sm"><span className="font-semibold">Hall Ticket No:</span> {studentData.hallTicketNo}</p>
                      <p className="text-sm"><span className="font-semibold">Registration No:</span> {studentData.registrationNo}</p>
                      <p className="text-sm"><span className="font-semibold">Student Name:</span> {studentData.name}</p>
                      <p className="text-sm"><span className="font-semibold">Course:</span> {studentData.course}</p>
                      <p className="text-sm"><span className="font-semibold">Test Center:</span> {studentData.testCenter}</p>
                      <p className="text-sm"><span className="font-semibold">Test Date:</span> {studentData.testDate}</p>
                    </div>
                  </div>

                  {/* Exam Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b">Examination Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <p className="text-sm"><span className="font-semibold">Reporting Time:</span> {studentData.reportingTime}</p>
                      <p className="text-sm"><span className="font-semibold">Exam Time:</span> {studentData.examTime}</p>
                      <p className="text-sm"><span className="font-semibold">Room No:</span> {studentData.roomNo}</p>
                      <p className="text-sm"><span className="font-semibold">Seat No:</span> {studentData.seatNo}</p>
                    </div>
                  </div>
                </div>

                {/* Photo and QR Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-40  flex items-center justify-center border">
                    <span >
                      <img src={profile} alt=""  className='h-[150px]'  />
                    </span>
                  </div>
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center border">
                    <span className="text-gray-500">QR Code</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-red-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Important Instructions</h3>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>Candidates must carry this hall ticket and a valid photo ID</li>
                  <li>Report 60 minutes before the scheduled time</li>
                  <li>Electronic devices are strictly prohibited</li>
                  <li>Follow all examination guidelines</li>
                </ul>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex justify-between items-end px-8 mb-8">
                  <div className="text-center">
                    <div className="w-32 h-16 border-b border-black mb-1"></div>
                    <p className="text-xs text-gray-600">Student Signature</p>
                  </div>

                  <div className="text-center">
                    <div className="w-20 h-20 border border-gray-300 rounded-full mb-2 mx-auto flex items-center justify-center">
                      <span className="text-xs text-gray-400">Official Seal</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-32 h-16 mb-1 mx-auto border-b border-black"></div>
                    <p className="text-xs text-gray-600">Controller of Examination</p>
                    <p className="text-[10px] text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Contact & Copyright */}
                <div className="border-t pt-4 space-y-2">
                  <div className="text-xs text-gray-500 text-center">
                    <p>For any queries, contact: +91 93227 60640 | exam@dkte.edu</p>
                  </div>
                  <div className="text-[10px] text-gray-400 text-center">
                    <p>This hall ticket is electronically generated and valid only with official seal</p>
                    <p>© {new Date().getFullYear()} DKTE College. All rights   reserved.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamHallTicket;