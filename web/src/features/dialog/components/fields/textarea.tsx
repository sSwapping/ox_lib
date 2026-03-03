import { createStyles, Textarea } from '@mantine/core';
import { UseFormRegisterReturn } from 'react-hook-form';
import { ITextarea } from '../../../../typings/dialog';
import React from 'react';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  register: UseFormRegisterReturn;
  row: ITextarea;
  index: number;
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
}));

const TextareaField: React.FC<Props> = (props) => {
  const { classes } = useStyles();

  return (
    <Textarea
      {...props.register}
      defaultValue={props.row.default}
      label={props.row.label}
      description={props.row.description}
      icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
      placeholder={props.row.placeholder}
      disabled={props.row.disabled}
      withAsterisk={props.row.required}
      autosize={props.row.autosize}
      minRows={props.row.min}
      maxRows={props.row.max}
      minLength={props.row.minLength}
      maxLength={props.row.maxLength}
      classNames={{ input: classes.input, label: classes.label }}
      variant="filled"
    />
  );
};

export default TextareaField;
