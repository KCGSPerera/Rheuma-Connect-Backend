const Appointment = require("../../models/appointment/Appointment");
const Patient = require("../../models/patient/Patient");
const Doctor = require("../../models/staff/Doctor");

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
};
