'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import styles from './subscribe.module.scss';
import Button from '../../../Button';
import Input from '../../../Input';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const subscribeSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.date().min(new Date('1900-01-01'), 'Please enter a valid date').max(new Date(), 'Date cannot be in the future'),
  email: z.string().email('Please enter a valid email address'),
});

type SubscribeFormData = z.infer<typeof subscribeSchema>;

function Subscribe() {
  const [isLoading, setIsLoading] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
    watch,
  } = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
  });
  const watchedValues = watch();
  const validateForm = (data: SubscribeFormData): string | null => {
    if (!data.email || data.email.trim() === '') {
      return 'Please enter your email address';
    }

    if (!data.firstName || data.firstName.trim() === '') {
      return 'Please enter your first name';
    }

    if (!data.lastName || data.lastName.trim() === '') {
      return 'Please enter your last name';
    }

    if (!data.dateOfBirth) {
      return 'Please select your date of birth';
    }


    return null;
  };
  const handleDateChange = (date: Date | null) => {
    setDateOfBirth(date);
    if (date) {
      setValue('dateOfBirth', date);
      // Clear date error when user selects a date
      if (errors.dateOfBirth) {
        setValue('dateOfBirth', date);
      }
    } else {
      setValue('dateOfBirth', undefined as any);
    }
  };
  const handleInputChange = (field: keyof SubscribeFormData) => (value: string) => {
    setValue(field, value);
    clearErrors(field);
  };
  const onSubmit = async (data: SubscribeFormData) => {
    console.log(data, "datadatadatadata123456789");

    setIsLoading(true);

    try {
      // Validate form before submission
      const validationError = validateForm(data);
      if (validationError) {
        toast.error(validationError);
        setIsLoading(false);
        return;
      }

    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  console.log(errors, "errorserrorserrors");

  return (
    <form onSubmit={handleSubmit((data: SubscribeFormData) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      onSubmit(data);
    })}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h3
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Բաժանորդագրվեք ISTAK-ի նորություններին
        </motion.h3>

        <motion.form
          className={styles.inputs}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}

        >
          <div className={styles.inputContainer}>
            <Input
              value={watchedValues.firstName || ''}
              onChange={handleInputChange('firstName')}
              variant="filled"
              size="large"
              error={errors.firstName?.message}
              name="firstName"
              id="firstName"
              placeholder="Անուն" />
          </div>
          <div className={styles.inputContainer}>
            <Input
              value={watchedValues.lastName || ''}
              onChange={handleInputChange('lastName')}
              variant="filled"
              size="large"
              error={errors.lastName?.message}
              name="lastName"
              id="lastName"
              placeholder="Ազգանուն"
            />
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.dateInputContainer}>
              <div className={styles.dateInputWrapper}>
                <DatePicker
                  selected={dateOfBirth}
                  onChange={handleDateChange}
                  placeholderText="օր / ամիս / տարի"
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}
                  minDate={new Date('1900-01-01')}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  wrapperClassName={styles.datePickerWrapper}
                  popperClassName={styles.datePickerPopper}
                  customInput={
                    <div className={styles.customDateInput}>
                      <input
                        type="text"
                        placeholder="օր / ամիս / տարի"
                        value={dateOfBirth ? dateOfBirth.toLocaleDateString('en-GB') : ''}
                        readOnly
                        className={errors.dateOfBirth ? styles.error : ''}
                      />
                    </div>
                  }
                />
              </div>
              {errors.dateOfBirth && <span className={styles.errorMessage}>{errors.dateOfBirth.message}</span>}
            </div>
          </div>
          <div className={styles.inputContainer}>
            <Input value={watchedValues.email || ''}
              onChange={handleInputChange('email')}
              variant="filled"
              size="large"
              error={errors.email?.message}
              name="email"
              id="email" placeholder="Էլ․ հասցե*" />
          </div>
        </motion.form>

        <motion.p
          className={styles.description1}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Սեղմելով «Ուղարկել» կոճակը՝ համաձայնվում եմ ստանալ անձնականացված հաղորդագրություններ ISTAK-ից և մասնակցելու բացառիկ միջոցառումների հրավերներին։ Լավագույն սպասարկման համար հասկանում եմ, որ իմ տվյալները մշակվելու են և կարող են օգտագործվել ISTAK ապրանքանիշի և նրա գործընկերների կողմից։      </motion.p>

        <motion.p
          className={styles.description2}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Ցանկացած պահի կարող եք հրաժարվել բաժանորդագրությունից՝ օգտվելով մեր կողմից տրամադրվող unsubscribe մեխանիզմից։ Լրացուցիչ տեղեկությունների համար այցելեք մեր Գաղտնիության քաղաքականություն էջը։»      </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          viewport={{ once: true }}
        >
          <Button text="Ուղարկել" variant="default" type="submit" onClick={() => { }} />
        </motion.div>
      </motion.div>
    </form>
  );
}

export default Subscribe;
