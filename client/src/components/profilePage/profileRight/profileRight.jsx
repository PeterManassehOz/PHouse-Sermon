import './profileRight.css'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRef, useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
//import { useDispatch } from 'react-redux';
//import { setProfile } from '../../../redux/profileSlice';
import { useUpdateProfileMutation } from '../../../redux/profileUpdateApi'
import { toast } from 'react-toastify'
import { FaArrowLeft } from 'react-icons/fa';
import PropTypes from 'prop-types';

const ProfileRight = ({ onBack }) => {
  const schema = yup.object().shape({
    firstname: yup.string().required('First name is required'),
    lastname: yup.string().required('Last name is required'),
    phcode: yup.string().required('PH Code is required'),
    phonenumber: yup.string().required('Phone number is required'),
    city: yup.string().required('City is required'),
    churchbranch: yup.string().required('Church branch is required'),
    state: yup.string().required('State is required'),
    zipcode: yup.string().required('Zip code is required'),
    address: yup.string().required('Address is required'),
    image: yup.mixed()
      .test('fileRequired', 'Image is required', (value) => !!value && value.length > 0), 
  })

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    const storedPhcode = localStorage.getItem('phcode'); // Get phcode from localStorage
    if (storedPhcode) {
      setValue('phcode', storedPhcode); // Set the phcode field
      console.log('PH Code from localStorage:', storedPhcode);
    }
  }, [setValue]);

  const [image, setImage] = useState(null)
  const imageRef = useRef()

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))
      setValue('image', event.target.files)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setValue('image', null) // Clear the `image` value for validation
  }

  //const dispatch = useDispatch();

  const [updateProfile, { isLoading } ] = useUpdateProfileMutation()

  const onSubmit = async (data) => {
    
    /*dispatch(setProfile(
      data.firstname,
      data.lastname,
      data.email,
      data.phonenumber,
      data.city,
      data.churchbranch,
      data.state,
      data.zipcode,
      data.address,
      data.image ? URL.createObjectURL(data.image[0]) : null
    )); // Update the profile state with the new data
    */

    const formData = new FormData()
    formData.append('firstname', data.firstname)
    formData.append('lastname', data.lastname)
    formData.append('phcode', data.phcode)
    formData.append('phonenumber', data.phonenumber)
    formData.append('city', data.city)
    formData.append('churchbranch', data.churchbranch)
    formData.append('state', data.state)
    formData.append('zipcode', data.zipcode)
    formData.append('address', data.address)
  
    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0]) // Send file properly
    }
  
    try {
      const response = await updateProfile(formData).unwrap()
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      console.log("Profile Updated:", response)

      // Clear the form fields after successful update
      reset()  // This will reset the form values and clear any validation errors
      setImage(null) // Clear the image preview
      toast.success('Profile updated successfully')

    } catch (error) {
      console.error("Update Error:", error)
      toast.error(error?.data?.message || 'Profile update failed')
    }

  }

  // Debugging current form values
  console.log('Current Form Values:', watch())

  return (
    <div className='profile-right'>
      {onBack && (
          <button className="back-button" onClick={onBack}>
            <FaArrowLeft />
          </button>
      )}

      <form className='profile-form' onSubmit={handleSubmit(onSubmit)}>
        <h2 className='profile-title'>Personal Information</h2>

        <div className='profile-name'>
          <div>
            <p>First Name</p>
            <input
              className='profile-input'
              type="text"
              placeholder='First Name'
              {...register("firstname")}
            />
            {errors.firstname && <p className="error">{errors.firstname.message}</p>}
          </div>

          <div>
            <p>Last Name</p>
            <input
              className='profile-input'
              type="text"
              placeholder='Last Name'
              {...register("lastname")}
            />
            {errors.lastname && <p className="error">{errors.lastname.message}</p>}
          </div>
        </div>

        <div className='profile-phcode'>
          <p>PH Code</p>
          <input
            className='profile-input'
            type="text"
            placeholder='PH Code'
            {...register("phcode")}
            readOnly
          />
          {errors.phcode && <p className="error">{errors.phcode.message}</p>}
        </div>

        <div className='profile-phone'>
          <div>
            <p>Phone Number</p>
            <input
              className='profile-input'
              type='number'
              placeholder='Phone Number'
              {...register("phonenumber")}
            />
            {errors.phonenumber && <p className="error">{errors.phonenumber.message}</p>}
          </div>

          <div>
            <p>City</p>
            <input
              className='profile-input'
              type='text'
              placeholder='City'
              {...register("city")}
            />
            {errors.city && <p className="error">{errors.city.message}</p>}
          </div>
        </div>

        <div className='profile-church'>
          <p>Church Name</p>
          <input
            className='profile-input'
            type="text"
            placeholder='Church Branch'
            {...register("churchbranch")}
          />
          {errors.churchbranch && <p className="error">{errors.churchbranch.message}</p>}
        </div>

        <div className='profile-state'>
          <div>
            <p>State</p>
            <input
              className='profile-input'
              type='text'
              placeholder='State'
              {...register("state")}
            />
            {errors.state && <p className="error">{errors.state.message}</p>}
          </div>

          <div>
            <p>Zip Code</p>
            <input
              className='profile-input'
              type='number'
              placeholder='Zip Code'
              {...register("zipcode")}
            />
            {errors.zipcode && <p className="error">{errors.zipcode.message}</p>}
          </div>
        </div>

        <div className="profile-address">
          <p>Address</p>
          <input
            className="profile-input"
            type="text"
            placeholder="Address"
            {...register("address")}
          />
          {errors.address && <p className="error">{errors.address.message}</p>}
        </div>

        {/* Image Upload */}
        <div className="image-upload-container">
          <button
            type="button"
            className="image-button"
            onClick={() => imageRef.current.click()}
          >
            Add Image
          </button>
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            ref={imageRef}
            className="image-input"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          {image && (
            <div className="image-preview-container">
              <div className="image-preview">
                <img src={image} alt="Uploaded" />
                <FaTimes className="cancel-icon" size={20} color="red" onClick={handleRemoveImage} />
              </div>
            </div>
          )}
          {errors.image && <p className="error">{errors.image.message}</p>}
        </div>

        <button className='profile-button' type='submit' disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Update Profile'}
        </button>
      </form>
    </div>
  )
}


ProfileRight.propTypes = {
  onBack: PropTypes.func,
};

export default ProfileRight
