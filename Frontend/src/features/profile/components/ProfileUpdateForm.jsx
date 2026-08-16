import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { updateProfile } from '../api';
import InputField from '../../../shared/components/InputField';
import './ProfileUpdateForm.css';

const ProfileUpdateForm = () => {
  const navigate = useNavigate();
  const { userProfile, refreshProfile } = useAuth();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    imageUrl: '',
    address: {
      id: 10,
      street: '',
      city: '',
      state: 'test',
      zipCode: '',
      country: 'test',
    },
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    street: '',
    zipCode: '',
    city: '',
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    street: false,
    zipCode: false,
    city: false,
  });

  useEffect(() => {
    if (!userProfile) return;

    const profile = userProfile?.data || userProfile;

    setForm({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phoneNumber: profile?.phone || '',
      imageUrl: profile?.imageUrl || '',
      address: {
        id: profile?.address?.id || 10,
        street: profile?.address?.street || '',
        city: profile?.address?.city || '',
        state: profile?.address?.state || 'test',
        zipCode: profile?.address?.zipCode || '',
        country: profile?.address?.country || 'test',
      },
    });
  }, [userProfile]);

  const validateField = (name, value) => {
    const trimmedValue = value.trim();

    switch (name) {
      case 'firstName':
        if (!trimmedValue) return 'Förnamn är obligatoriskt';
        if (trimmedValue.length < 2) return 'Förnamn måste vara minst 2 tecken';
        return '';

      case 'lastName':
        if (!trimmedValue) return 'Efternamn är obligatoriskt';
        if (trimmedValue.length < 2)
          return 'Efternamn måste vara minst 2 tecken';
        return '';

      case 'phoneNumber':
        if (!trimmedValue) return '';
        if (!/^[0-9+\s()-]{7,20}$/.test(trimmedValue)) {
          return 'Ogiltigt telefonnummer';
        }
        return '';

      case 'street':
        if (!trimmedValue) return 'Gatuadress är obligatorisk';
        return '';

      case 'zipCode':
        if (!trimmedValue) return 'Postnummer är obligatoriskt';
        return '';

      case 'city':
        if (!trimmedValue) return 'Stad är obligatorisk';
        return '';

      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: validateField('firstName', form.firstName),
      lastName: validateField('lastName', form.lastName),
      phoneNumber: validateField('phoneNumber', form.phoneNumber),
      street: validateField('street', form.address.street),
      zipCode: validateField('zipCode', form.address.zipCode),
      city: validateField('city', form.address.city),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (error) {
      setError('');
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    if (error) {
      setError('');
    }

    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setForm((prev) => ({
      ...prev,
      [name]: trimmedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, trimmedValue),
    }));
  };

  const handleAddressBlur = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: trimmedValue,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, trimmedValue),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    setTouched({
      firstName: true,
      lastName: true,
      phoneNumber: true,
      street: true,
      zipCode: true,
      city: true,
    });

    const isValid = validateForm();

    if (!isValid) return;

    try {
      setLoading(true);

      const cleanedForm = {
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        imageUrl: form.imageUrl.trim(),
        address: {
          ...form.address,
          street: form.address.street.trim(),
          city: form.address.city.trim(),
          zipCode: form.address.zipCode.trim(),
        },
      };

      await updateProfile(cleanedForm);
      await refreshProfile();

      navigate('/konto');
    } catch (err) {
      console.error('Completion of profile failed', err);

      const apiErrors = err?.response?.data?.errors;

      if (apiErrors) {
        setErrors((prev) => ({
          ...prev,
          firstName: apiErrors.FirstName?.[0] || prev.firstName,
          lastName: apiErrors.LastName?.[0] || prev.lastName,
          phoneNumber: apiErrors.PhoneNumber?.[0] || prev.phoneNumber,
          street: apiErrors['Address.Street']?.[0] || prev.street,
          zipCode: apiErrors['Address.ZipCode']?.[0] || prev.zipCode,
          city: apiErrors['Address.City']?.[0] || prev.city,
        }));

        setTouched({
          firstName: true,
          lastName: true,
          phoneNumber: true,
          street: true,
          zipCode: true,
          city: true,
        });

        setError(null);
      } else {
        setError(
          err?.response?.data?.message || err.message || 'Något gick fel',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const profile = userProfile?.data || userProfile;

  return (
    <form className="" onSubmit={handleSubmit} noValidate>
      <InputField
        label="Mejladress"
        id="email"
        type="email"
        disabled
        placeholder="Email"
        value={profile?.email || ''}
        autoComplete="email"
        className="full-width"
      />

      <InputField
        label="Namn"
        id="first-name"
        className="input"
        type="text"
        name="firstName"
        placeholder="Förnamn"
        autoComplete="given-name"
        disabled={loading}
        value={form.firstName}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        maxLength={50}
        aria-invalid={!!errors.firstName}
        aria-describedby={errors.firstName ? 'first-name-error' : undefined}
        touched={touched.firstName}
        errorMessage={errors.firstName}
        errorClassName="input-error-shared"
      />

      <InputField
        invisibleLabel={true}
        id="last-name"
        className="input"
        type="text"
        name="lastName"
        placeholder="Efternamn"
        autoComplete="family-name"
        disabled={loading}
        value={form.lastName}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        maxLength={50}
        aria-invalid={!!errors.lastName}
        aria-describedby={errors.lastName ? 'last-name-error' : undefined}
        touched={touched.lastName}
        errorMessage={errors.lastName}
        errorClassName="input-error-shared"
      />

      <InputField
        label="Telefon"
        id="phone-number"
        className="full-width"
        type="tel"
        name="phoneNumber"
        placeholder="Telefonnummer"
        autoComplete="tel"
        inputMode="tel"
        disabled={loading}
        value={form.phoneNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={!!errors.phoneNumber}
        aria-describedby={errors.phoneNumber ? 'phone-number-error' : undefined}
        touched={touched.phoneNumber}
        errorMessage={errors.phoneNumber}
        errorClassName="input-error-shared"
      />

      <InputField
        label="Adress"
        id="street"
        className="full-width"
        type="text"
        name="street"
        placeholder="Gata"
        autoComplete="street-address"
        disabled={loading}
        value={form.address.street}
        onChange={handleAddressChange}
        onBlur={handleAddressBlur}
        aria-invalid={!!errors.street}
        aria-describedby={errors.street ? 'street-error' : undefined}
        touched={touched.street}
        errorMessage={errors.street}
        errorClassName="input-error-shared"
      />

      <InputField
        id="zip-code"
        className="input"
        type="text"
        name="zipCode"
        placeholder="Postnummer"
        autoComplete="postal-code"
        inputMode="numeric"
        disabled={loading}
        value={form.address.zipCode}
        onChange={handleAddressChange}
        onBlur={handleAddressBlur}
        aria-invalid={!!errors.zipCode}
        aria-describedby={errors.zipCode ? 'zip-code-error' : undefined}
        touched={touched.zipCode}
        errorMessage={errors.zipCode}
        errorClassName="input-error-shared"
      />

      <InputField
        id="city"
        className="input"
        type="text"
        name="city"
        placeholder="Stad"
        autoComplete="address-level2"
        disabled={loading}
        value={form.address.city}
        onChange={handleAddressChange}
        onBlur={handleAddressBlur}
        aria-invalid={!!errors.city}
        aria-describedby={errors.city ? 'city-error' : undefined}
        touched={touched.city}
        errorMessage={errors.city}
        errorClassName="input-error-shared"
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        disabled={loading}
        type="submit"
        className="button button-prim full-width"
      >
        {loading ? 'Uppdaterar...' : 'Uppdatera'}
        {!loading && <ArrowRight className="account_icon_arrow" />}
      </button>
    </form>
  );
};

export default ProfileUpdateForm;
