import { Checkbox, createStyles } from '@mantine/core';
import { ICheckbox } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  row: ICheckbox;
  index: number;
  register: UseFormRegisterReturn;
}

const useStyles = createStyles((theme) => ({
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:checked': {
      backgroundColor: '#ffa3e9',
      borderColor: '#ffa3e9',
      color: '#141414',
    },
    '&:hover': {
      borderColor: '#ffa3e9',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  label: {
    color: theme.colors.gray[4],
    fontWeight: 500,
    fontSize: 14,
    paddingLeft: 12,
    cursor: 'pointer',
  },
  icon: {
    color: '#141414',
  },
}));

const CheckboxField: React.FC<Props> = (props) => {
  const { classes } = useStyles();

  return (
    <Checkbox
      {...props.register}
      sx={{ display: 'flex' }}
      required={props.row.required}
      label={props.row.label}
      defaultChecked={props.row.checked}
      disabled={props.row.disabled}
      classNames={{
        input: classes.input,
        label: classes.label,
        icon: classes.icon,
      }}
    />
  );
};

export default CheckboxField;
