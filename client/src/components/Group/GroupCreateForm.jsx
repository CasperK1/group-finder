import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { apiService } from '../../services/api/apiService';
import { AuthContext } from '../../provider/AuthProvider';
import { toast } from 'react-toastify';

function GroupCreateForm() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const jwt = localStorage.getItem('jwtToken');
      if (!jwt) {
        toast.error('You must be logged in to create a group');
        navigate('/login');
        return;
      }

      const groupData = {
        name: data.name,
       // yearOfStudy: data.yearOfStudy,
        bio: data.bio,
        city: data.city,
        timePreference: data.timePreference,
        location: data.location,
        groupSize: parseInt(data.groupSize),
        major: data.major,
        inviteOnly: data.inviteOnly === 'true',
      };

      const response = await apiService.group.createGroup(groupData, { token: jwt });
      if (response) {
        toast.success('Group created successfully!', { position: 'top-right' });
        navigate(`/group/${response._id}`);
      } else {
        toast.error('Failed to create group. Please try again.', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group. Please try again.', { position: 'top-right' });
    }
  };

  const onError = (errors) => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message, { position: 'top-right' });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Group name is required' }}
        render={({ field }) => (
          <div>
            <label className="block text-base-content/70 text-sm mb-1">Group Name</label>
            <input
              {...field}
              type="text"
              className="input input-bordered w-full bg-base-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              placeholder="Enter group name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
        )}
      />

      <Controller
        name="bio"
        control={control}
        rules={{ maxLength: { value: 1000, message: 'Bio cannot exceed 1000 characters' } }}
        render={({ field }) => (
          <div>
            <label className="block text-base-content/70 text-sm mb-1">Group Bio</label>
            <textarea
              {...field}
              className="w-full p-3 border border-base-300 rounded-lg bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 resize-y"
              placeholder="Describe your group (max 1000 characters)"
              rows="4"
            />
            {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
          </div>
        )}
      />

      <Controller
        name="city"
        control={control}
        rules={{ required: 'City is required' }}
        render={({ field }) => (
          <div>
            <label className="block text-base-content/70 text-sm mb-1">City</label>
            <input
              {...field}
              type="text"
              className="input input-bordered w-full bg-base-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              placeholder="Enter city"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
        )}
      />

      <Controller
        name="timePreference"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block text-base-content/70 text-sm mb-1">Preferred Time</label>
            <select
              {...field}
              className="select select-bordered w-full bg-base-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        )}
      />

      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block text-base-content/70 text-sm mb-1">Location Preference</label>
            <select
              {...field}
              className="select select-bordered w-full bg-base-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            >
              <option value="on-campus">On-Campus</option>
              <option value="off-campus">Off-Campus</option>
              <option value="online">Online</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        )}
      />

      <Controller
        name="groupSize"
        control={control}
        rules={{
          required: 'Group size is required',
          min: { value: 2, message: 'Minimum group size is 2' },
          max: { value: 10, message: 'Maximum group size is 10' },
        }}
        render={({ field }) => (
          <div>
            <label className="block text-base-content/70 text-sm mb-1">Group Size</label>
            <input
              {...field}
              type="number"
              className="input input-bordered w-full bg-base-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              placeholder="Enter group size (2-10)"
            />
            {errors.groupSize && <p className="text-red-500 text-xs mt-1">{errors.groupSize.message}</p>}
          </div>
        )}
      />

      <Controller
        name="major"
        control={control}
        render={({ field }) => (
          <div>
             <label className="block text-base-content/70 text-sm mb-1">Major</label>
            <select
              {...field}
              className="select select-bordered w-full bg-base-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            >
              <option value="smart-iot-systems">Smart IoT Systems</option>
              <option value="software-engineering">Software Engineering</option>
              <option value="health-tech">Health Tech</option>
              <option value="web-development">Web Development</option>
              <option value="game-development">Game Development</option>
            </select>
          </div>
        )}
      />

<Controller
        name="year-of-study"
        control={control}
        render={({ field }) => (
          <div>
             <label className="block text-base-content/70 text-sm mb-1">Year of Study</label>
            <select
              {...field}
              className="select select-bordered w-full bg-base-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            >
              <option value="first-year">First Year</option>
              <option value="second-year">Second Year</option>
              <option value="third-year">Third Year</option>
              <option value="senior-level">Senior Level</option>
            </select>
          </div>
        )}
      />  

      <Controller
        name="inviteOnly"
        control={control}
        render={({ field }) => (
          <div className="flex items-center">
            <input
              {...field}
              type="checkbox"
              className="checkbox checkbox-primary mr-2"
              value={field.value ? 'true' : 'false'}
              onChange={(e) => field.onChange(e.target.checked ? 'true' : 'false')}
            />
            <label className="text-base-content/70 text-sm">Invite Only</label>
          </div>
        )}
      />

      <button
        type="submit"
        className="btn btn-primary w-full rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
      >
        Create Group
      </button>
    </form>
  );
}

export default GroupCreateForm;