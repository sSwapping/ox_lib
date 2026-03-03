import { IColorInput } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import { ColorInput, createStyles } from '@mantine/core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: IColorInput;
  index: number;
  control: Control<FormValues>;
}

const useStyles = createStyles((theme) => ({
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff3fc',
    borderRadius: 6,
    transition: 'all 0.2s ease',
    '&:focus': {
      borderColor: 'rgba(255, 163, 233, 0.5)',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 163, 233, 0.4)',
    },
    '&::placeholder': {
      color: 'rgba(255, 163, 233, 0.2)',
    },
  },
  label: {
    color: theme.colors.gray[4],
    fontWeight: 500,
    fontSize: 14,
    marginBottom: 4,
  },
  dropdown: {
    backgroundColor: '#1a1a1a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    borderRadius: 6,
    padding: 10,
  },
  body: {
    backgroundColor: '#1a1a1a',
  },
  swatch: {
    cursor: 'pointer',
  },
}));

const ColorField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    defaultValue: props.row.default,
    rules: { required: props.row.required },
  });
  const { classes } = useStyles();

  return (
    <ColorInput
      withEyeDropper={false}
      value={controller.field.value}
      name={controller.field.name}
      ref={controller.field.ref}
      onBlur={controller.field.onBlur}
      onChange={controller.field.onChange}
      label={props.row.label}
      description={props.row.description}
      disabled={props.row.disabled}
      defaultValue={props.row.default}
      format={props.row.format}
      withAsterisk={props.row.required}
      icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
      classNames={{
        input: classes.input,
        label: classes.label,
        dropdown: classes.dropdown,
        body: classes.body,
        swatch: classes.swatch,
      }}
      variant="filled"
    />
  );
};

export default ColorField;
