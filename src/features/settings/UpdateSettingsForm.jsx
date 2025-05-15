import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';
import { useSettings } from './useSettings';
import { useUpdateSetting } from './useUpdateSetting';

function UpdateSettingsForm() {
  const {isLoading, settings: {
    minBoodkingLength, 
    maxBoodkingLength, 
    maxGuestsPerBooking,
    breakfast
  } = {}, }= useSettings();

  const {isUpdating, updateSetting}= useUpdateSetting();

  if(isLoading) return <Spinner /> 

  function handleUpdate(e, field){
    const {value} = e.target
    if(!value) return ;
    updateSetting({
      [field]: value
    })
  }

  return (
    <Form>
      <FormRow label='Minimum nights/booking'>
        <Input type='number' id='min-nights' 
        defaultValue={minBoodkingLength} 
        disabled={isUpdating}
        onBlur={e=> handleUpdate(e, 'minBoodkingLength')}
        />
      </FormRow>

      <FormRow label='Maximum nights/booking'>
        <Input type='number' id='max-nights' 
        defaultValue={maxBoodkingLength}
        disabled={isUpdating}
        onBlur={e=> handleUpdate(e, 'maxBoodkingLength')}
        />
        
      </FormRow>

      <FormRow label='Maximum guests/booking'>
        <Input type='number' id='max-guests'
        defaultValue={maxGuestsPerBooking} 
        disabled={isUpdating}
        onBlur={e=> handleUpdate(e, 'maxGuestsPerBooking')}
        />
      </FormRow>

      <FormRow label='Breakfast price'>
        <Input type='number' id='breakfast-price' 
        defaultValue={breakfast}
        disabled={isUpdating}
        onBlur={e=> handleUpdate(e, 'breakfast')}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
