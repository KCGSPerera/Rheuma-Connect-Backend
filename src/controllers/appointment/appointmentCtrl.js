const Appointment = require("../../models/appointment/Appointment");
const Patient = require("../../models/patient/Patient");
const Doctor = require("../../models/staff/Doctor");
const moment = require('moment'); 

// Add new appointment
const addAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, roomNo } = req.body;

    // Create a new appointment
    const newAppointment = new Appointment({
      patientId,
      consultant: doctorId,
      date,
      time,
      roomNo,
      status: "Scheduled",
    });

    const savedAppointment = await newAppointment.save();

    // Update the patient's next and last appointment dates
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Set last and next appointment dates
    patient.lastAppDateTime = patient.nextAppDateTime || null;
    patient.nextAppDateTime = date;
    patient.appointments.push(savedAppointment._id);
    await patient.save();

    // Push the appointment to the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    doctor.appointments.push(savedAppointment._id);
    await doctor.save();

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: savedAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { patientId, status } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      { patientId },
      { status },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment status updated", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment status", error });
  }
};

// Reschedule appointment
const rescheduleAppointment = async (req, res) => {
  try {
    const { patientId, newDate, newTime, newRoomNo } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      { patientId },
      {
        status: "Rescheduled",
        date: newDate,
        time: newTime,
        roomNo: newRoomNo,
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update the patient's next appointment date
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patient.nextAppDateTime = newDate;
    await patient.save();

    res.status(200).json({ message: "Appointment rescheduled", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error rescheduling appointment", error });
  }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const { patientId } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      { patientId },
      { status: "Cancelled" },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment cancelled", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling appointment", error });
  }
};

// Get one appointment for a patient
const getAppointmentForPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointment = await Appointment.findOne({ patientId });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ appointment });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment", error });
  }
};

// Get one appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ appointment });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment", error });
  }
};

// Get all appointments for a particular date
const getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const appointments = await Appointment.find({ date });
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Get all Scheduled appointments
const getScheduledAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: "Scheduled" });
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Get all Completed appointments
const getCompletedAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: "Completed" });
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Get all Cancelled appointments
const getCancelledAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: "Cancelled" });
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Get all Rescheduled appointments
const getRescheduledAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: "Rescheduled" });
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Get all Scheduled appointments for the current day
const getScheduledAppointmentsForToday = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const appointments = await Appointment.find({ date: today, status: "Scheduled" });
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's appointments", error });
  }
};

// Get all Rescheduled appointments for the current day
const getRescheduledAppointmentsForToday = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const appointments = await Appointment.find({ date: today, status: "Rescheduled" });
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's rescheduled appointments", error });
  }
};

// Get all Scheduled and Rescheduled appointments for the current day
const getAllScheduledAndRescheduledForToday = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const appointments = await Appointment.find({
      date: today,
      status: { $in: ["Scheduled", "Rescheduled"] },
    });
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's appointments", error });
  }
};

// Get the last appointment for a patient
const getPatientLastAppointment = async (req, res) => {
    try {
      const { patientId } = req.params;
  
      // Find the patient by ID and populate the appointments array
      const patient = await Patient.findById(patientId).populate({
        path: 'appointments',
        options: { sort: { _id: -1 }, limit: 1 } // Get the last appointment
      });
  
      if (!patient || patient.appointments.length === 0) {
        return res.status(404).json({ message: "No appointment found for this patient." });
      }
  
      const lastAppointment = patient.appointments[0]; // Retrieve the last appointment
  
      res.status(200).json({ appointment: lastAppointment });
    } catch (error) {
      res.status(500).json({ message: "Error fetching the last appointment", error });
    }
  };

 // Import Moment.js

  const addAppointmentAndCompleteLastAppointment = async (req, res) => {
    try {
      const { patientId, consultant, date, time, roomNo } = req.body;
  
      // Parse the incoming date using Moment.js
      const appointmentDate = moment(date).add(1, 'hours'); // Adjust for timezone if needed
  
      // Find the last appointment for the given patientId with status "Scheduled"
      const lastAppointment = await Appointment.findOne({
        patientId: patientId,
        status: "Scheduled", // We only want to complete the last "Scheduled" appointment
      }).sort({ date: -1, time: -1 }); // Sort by the most recent date and time
  
      // If there's a last appointment, update its status to "Completed"
      if (lastAppointment) {
        lastAppointment.status = "Completed";
        await lastAppointment.save(); // Save the changes
      }
  
      // Create a new appointment with formatted date
      const newAppointment = new Appointment({
        patientId,
        consultant: consultant,
        date: appointmentDate.toDate(), // Convert Moment object back to JavaScript Date
        time,
        roomNo,
        status: "Scheduled", // Set new appointment status to "Scheduled"
      });
  
      const savedAppointment = await newAppointment.save();
  
      res.status(201).json({
        message: "Appointment created successfully, previous appointment completed",
        appointment: savedAppointment,
        lastAppointment: lastAppointment ? lastAppointment : "No previous appointment found",
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating appointment", error });
    }
  };

  
// add new Appointment And Complete Last Appointment status as completed 
// const addAppointmentAndCompleteLastAppointment = async (req, res) => {
//   try {
//     const { patientId, consultant, date, time, roomNo } = req.body;

//     // Create a new appointment
//     const newAppointment = new Appointment({
//       patientId,
//       consultant: consultant,
//       date,
//       time,
//       roomNo,
//       status: "Scheduled",
//     });

//     const savedAppointment = await newAppointment.save();


//     res.status(201).json({
//       message: "Appointment created successfully",
//       appointment: savedAppointment,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating appointment", error });
//   }
// };

// const addAppointmentAndCompleteLastAppointment = async (req, res) => {
//   try {
//     const { patientId, consultant, date, time, roomNo } = req.body;

//     // Parse the incoming date and time, adjusting for your timezone if necessary
//     const appointmentDate = new Date(date); // Assuming date is in the correct format (e.g., "2024-10-11")
//     appointmentDate.setHours(appointmentDate.getHours() + 1); // Adjust for timezone if needed

//     // Find the last appointment for the given patientId with status "Scheduled"
//     const lastAppointment = await Appointment.findOne({
//       patientId: patientId,
//       status: "Scheduled", // We only want to complete the last "Scheduled" appointment
//     }).sort({ date: -1, time: -1 }); // Sort by the most recent date and time

//     // If there's a last appointment, update its status to "Completed"
//     if (lastAppointment) {
//       lastAppointment.status = "Completed";
//       await lastAppointment.save(); // Save the changes
//     }

//     // Create a new appointment
//     const newAppointment = new Appointment({
//       patientId,
//       consultant: consultant,
//       date: appointmentDate, // Use the adjusted appointment date
//       time,
//       roomNo,
//       status: "Scheduled", // Set new appointment status to "Scheduled"
//     });

//     const savedAppointment = await newAppointment.save();

//     res.status(201).json({
//       message: "Appointment created successfully, previous appointment completed",
//       appointment: savedAppointment,
//       lastAppointment: lastAppointment ? lastAppointment : "No previous appointment found",
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating appointment", error });
//   }
// };


// const addAppointmentAndCompleteLastAppointment = async (req, res) => {
//   try {
//     const { patientId, consultant, date, time, roomNo } = req.body;

//     // Find the last appointment for the given patientId with status "Scheduled"
//     const lastAppointment = await Appointment.findOne({
//       patientId: patientId,
//       status: "Scheduled", // We only want to complete the last "Scheduled" appointment
//     }).sort({ date: -1, time: -1 }); // Sort by the most recent date and time

//     // If there's a last appointment, update its status to "Completed"
//     if (lastAppointment) {
//       lastAppointment.status = "Completed";
//       await lastAppointment.save(); // Save the changes
//     }

//     // Create a new appointment
//     const newAppointment = new Appointment({
//       patientId,
//       consultant: consultant,
//       date,
//       time,
//       roomNo,
//       status: "Scheduled", // Set new appointment status to "Scheduled"
//     });

//     const savedAppointment = await newAppointment.save();

//     res.status(201).json({
//       message: "Appointment created successfully, previous appointment completed",
//       appointment: savedAppointment,
//       lastAppointment: lastAppointment ? lastAppointment : "No previous appointment found",
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating appointment", error });
//   }
// };


const getLastAppointmentByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    const lastAppointment = await Appointment.findOne({ patientId })
      .sort({ date: -1, time: -1 }) // Sort by date and time to get the most recent appointment
      .populate('consultant patientId patientVitals medicalRecords');

    if (!lastAppointment) {
      return res.status(404).json({ message: "No appointments found for this patient." });
    }

    res.status(200).json({ appointment: lastAppointment });
  } catch (error) {
    res.status(500).json({ message: "Error fetching the last appointment", error });
  }
};

const getLastScheduledAppointmentByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    const lastScheduledAppointment = await Appointment.findOne({ patientId, status: 'Scheduled' })
      .sort({ date: -1, time: -1 }) // Sort by date and time to get the most recent scheduled appointment
      .populate('consultant patientId patientVitals medicalRecords');

    if (!lastScheduledAppointment) {
      return res.status(404).json({ message: "No scheduled appointments found for this patient." });
    }

    res.status(200).json({ appointment: lastScheduledAppointment });
  } catch (error) {
    res.status(500).json({ message: "Error fetching the last scheduled appointment", error });
  }
};

const getAppointmentsForTodayWithScheduledStatus = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0); // Set the time to midnight for today's date

    const scheduledAppointments = await Appointment.find({
      date: { $eq: today }, // Find appointments where the date is today
      status: 'Scheduled',  // Status is Scheduled
    })
    .populate('consultant patientId patientVitals medicalRecords');

    if (!scheduledAppointments.length) {
      return res.status(404).json({ message: "No scheduled appointments found for today." });
    }

    res.status(200).json({ appointments: scheduledAppointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's scheduled appointments", error });
  }
};

const getPatientsForTodayAppointmentWithScheduledStatus = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0); // Set the time to midnight for today's date

    const scheduledAppointments = await Appointment.find({
      date: { $eq: today }, // Find appointments where the date is today
      status: 'Scheduled',  // Status is Scheduled
    })
    .populate({
      path: 'patientId', // Populate patientId field to retrieve patient details
      select: 'name medicalId', // Only select the patient's name and medicalId
    })
    .populate('consultant patientVitals medicalRecords'); // Populate other fields as necessary

    if (!scheduledAppointments.length) {
      return res.status(404).json({ message: "No scheduled appointments found for today." });
    }

    // Extract patient details from the scheduled appointments
    const patientsWithScheduledAppointments = scheduledAppointments.map(app => app.patientId);

    res.status(200).json({ patients: patientsWithScheduledAppointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's scheduled patients", error });
  }
};

// Get appointments by patient ID where status is "Scheduled"
const getScheduledAppointmentsByPatientId = async (req, res) => {
  const { patientId } = req.params;
  
  try {
    const appointments = await Appointment.find({
      patientId: patientId,
      status: "Scheduled"
    }).populate('consultant', 'name') // Populate consultant's name
      .populate('patientVitals') // Optionally populate patientVitals
      .populate('medicalRecords'); // Optionally populate medicalRecords

    if (!appointments) {
      return res.status(404).json({ message: 'No scheduled appointments found for this patient.' });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error: error.message });
  }
};

module.exports = {
  addAppointment,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
  getAppointmentForPatient,
  getAppointmentById,
  getAppointmentsByDate,
  getScheduledAppointments,
  getCompletedAppointments,
  getCancelledAppointments,
  getRescheduledAppointments,
  getScheduledAppointmentsForToday,
  getRescheduledAppointmentsForToday,
  getAllScheduledAndRescheduledForToday,
  getPatientLastAppointment,
  addAppointmentAndCompleteLastAppointment,
  getLastAppointmentByPatientId,
  getLastScheduledAppointmentByPatientId,
  getAppointmentsForTodayWithScheduledStatus,
  getPatientsForTodayAppointmentWithScheduledStatus,
  getScheduledAppointmentsByPatientId,
};
