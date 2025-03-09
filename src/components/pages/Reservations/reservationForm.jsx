import React from "react";
import { Formik } from "formik";
import FormField from "./formField";
import emailjs from '@emailjs/browser';

const ReservationForm = ({ availableTimes, dispatchOnDateChange, submitData }) => {
  const minimumDate = new Date().toISOString().split("T")[0];
  const minimumNumberOfGuests = 1;
  const maximumNumberOfGuests = 10;
  const occasions = ["Birthday", "Anniversary", "Engagement", "Other"];

  return (
    <Formik
      initialValues={{
        name: "",
        mail: "",
        date: minimumDate,
        time: availableTimes[0],
        numberOfGuests: minimumNumberOfGuests,
        occasion: occasions[0],
      }}
      validate={(values) => {
        const errors = {};
        if (!values.name) {
          errors.name = "Please enter your name";
        }
        if (!values.mail) {
          errors.mail = "Please enter an email";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.mail)
        ) {
          errors.mail = "Invalid email address";
        }
        if (!values.date) {
          errors.date = "Please choose a valid date";
        }
        if (!values.time) {
          errors.time = "Please choose a valid time";
        }
        if (!values.numberOfGuests || values.numberOfGuests < minimumNumberOfGuests || values.numberOfGuests > maximumNumberOfGuests) {
          errors.numberOfGuests = `Please enter a number between ${minimumNumberOfGuests} and ${maximumNumberOfGuests}`;
        }
        if (!values.occasion) {
          errors.occasion = "Please choose a valid occasion";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        const service_id = 'service_i3vng1m';
        const template_id = 'template_ueghurd';
        const public_id = 'gbtOYXQ6SZQAOaHko';

        const templateParams = {
          from_name: "Little Lemon",
          user_email: values.mail,
          to_name: values.name,
          message: `You have a reservation on ${values.date} at ${values.time} for ${values.numberOfGuests} guests.`,
        };

        emailjs.send(service_id, template_id, templateParams, public_id)
          .then((response) => {
            console.log("Email sent successfully:", response);
          })
          .catch((error) => {
            console.error("Error sending email:", error);
          })
          .finally(() => setSubmitting(false));

        submitData(values);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <FormField label="Name" htmlFor="reservation-name">
            <input
              type="text"
              name="name"
              id="reservation-name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            {errors.name && touched.name && <div className="error">{errors.name}</div>}
          </FormField>

          <FormField label="Email address" htmlFor="reservation-mail">
            <input
              type="email"
              name="mail"
              id="reservation-mail"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.mail}
            />
            {errors.mail && touched.mail && <div className="error">{errors.mail}</div>}
          </FormField>

          <FormField label="Date" htmlFor="reservation-date">
            <input
              type="date"
              name="date"
              id="reservation-date"
              min={minimumDate}
              onChange={(e) => {
                handleChange(e);
                dispatchOnDateChange(e.target.value);
              }}
              onBlur={handleBlur}
              value={values.date}
            />
            {errors.date && touched.date && <div className="error">{errors.date}</div>}
          </FormField>

          <FormField label="Time" htmlFor="reservation-time">
            <select
              name="time"
              id="reservation-time"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.time}
            >
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.time && touched.time && <div className="error">{errors.time}</div>}
          </FormField>

          <FormField label="Number of guests" htmlFor="reservation-number-guests">
            <input
              type="number"
              name="numberOfGuests"
              id="reservation-number-guests"
              min={minimumNumberOfGuests}
              max={maximumNumberOfGuests}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.numberOfGuests}
            />
            {errors.numberOfGuests && touched.numberOfGuests && (
              <div className="error">{errors.numberOfGuests}</div>
            )}
          </FormField>

          <FormField label="Occasion" htmlFor="reservation-occasion">
            <select
              name="occasion"
              id="reservation-occasion"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.occasion}
            >
              {occasions.map((occasion) => (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              ))}
            </select>
            {errors.occasion && touched.occasion && <div className="error">{errors.occasion}</div>}
          </FormField>

          <button
            className="button-primary"
            type="submit"
            disabled={isSubmitting}
          >
            Reserve now!
          </button>
        </form>
      )}
    </Formik>
  );
};

export default ReservationForm;
