import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import schema from '../../graphql/graphql';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, TextField, CircularProgress } from '@material-ui/core';
import React from 'react';
import validators from '../../validators';

function CreateUserDialog(props) {
  const { onClose, open, limit, skip } = props;


  const { register, handleSubmit, watch, errors } = useForm({
    validationSchema: validators.user.userSchema,
    reValidateMode: 'onChange',
  });

  const updateCache = (cache, {data}) => {

    let show = schema.queries.SHOW_USERS

    const users = cache.readQuery({
      query: show,
      variables: {
        limit,
        skip
      }
    });

    users.users.push(data.createUser)

    cache.writeQuery({
      query: schema.queries.SHOW_USERS,
      data: { users: users.users },
      variables: {
        limit,
        skip
      }
    });
  };


  const [createUser, { loading, error }] = useMutation(schema.mutations.CREATE_USER, { update: updateCache});

  const onSubmitCreateUserForm = input => {
    try{
      let { data } = createUser({ variables: { input } });

      if(data) {
        onClose()
      }
    } catch (e) {
      e.graphQLErrors.map(x => {
        console.log(x.message);
      });
    }
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: 'calc(100% - 16px)',
        display: 'flex'
      }
    },
  }));
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Create user</DialogTitle>
      {loading ? <CircularProgress /> :
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmitCreateUserForm)}>
        <TextField id="standard-basic" label="Name" name="name" variant="outlined"
                   inputRef={register}
                   error={errors.name}
                   helperText={errors.name ? errors.name.message : ''}
        />
        <TextField id="standard-basic" label="Email" name="email" variant="outlined"
                   inputRef={register}
                   error={errors.email}
                   helperText={errors.email ? errors.email.message : ''}
        />
        <Button type="submit" variant="contained" color="primary">
          Create User
        </Button>
      </form>
      }
    </Dialog>
  );
}

export default CreateUserDialog