import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  CircularProgress
} from '@material-ui/core';
import { TextField, Card, Paper, IconButton, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Edit, Delete, Add, Done, Close } from '@material-ui/icons';

import TablePaginationActions from './pagination';
import CreateUserDialog from './create';


import { useForm } from 'react-hook-form';


import validators from '../../validators';
import schema from '../../graphql/graphql';


const UserList = props => {

  const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 650
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }));
  const classes = useStyles();

  const [updatedId, setUpdatedId] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);

  let { loading, error, data={} } = useQuery(schema.queries.SHOW_USERS, {
    variables: {
      skip: page*limit,
      limit: limit
    }
  });

  const updateCache = (cache, {data}) => {

    let show = schema.queries.SHOW_USERS

    const users = cache.readQuery({
      query: show,
      variables: {
        limit: limit,
        skip: limit*page,
      }
    });

    cache.writeQuery({
      query: schema.queries.SHOW_USERS,
      data: { users: users.users.filter(user => (user.id !== data.deleteUser.id)) },
      variables: {
        limit: limit,
        skip: limit*page
      }
    });
  };

  const [updateUser, { error: updateError }] = useMutation(schema.mutations.UPDATE_USER);

  const [deleteUser, { error: deleteError }] = useMutation(schema.mutations.DELETE_USER, {update: updateCache});

  const { register, handleSubmit, watch, errors } = useForm({
    validationSchema: validators.user.userSchema,
    reValidateMode: 'onChange',
  });


  const [open, setOpen] = useState(false);



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };


  const onSubmitUpdateUserForm = input => {
    try{
      let { data, error, loading } = updateUser({ variables: { id: updatedId, input } });
      setUpdatedId(null);
    } catch (e) {
      e.graphQLErrors.map(x => {
        console.log(x.message);
      });
    }
  };

  function handleDeleteUser(id) {
    deleteUser({
      variables: { id }
    })
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  }

  if(loading || error) {
    return <div><CircularProgress /></div>;
  }

  if(deleteError || updateError) {
    console.log(deleteError)
    return <pre>Bad: {error.graphQLErrors.map(({ message }, i) => <span key={i}>{message}</span>)}</pre>
  }
  return (
    <Card>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Actions</TableCell>
              <TableCell align="left">Id</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Email</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(limit > 0 && data.users).map(({ id, name, email }) => (
              <TableRow key={id}>
                {updatedId === id ?
                  <>
                    <TableCell component="th" scope="row" align="left" >
                      <IconButton tooltip="show" onClick={() => setUpdatedId(null)}>
                        <Close color="primary" />
                      </IconButton>
                      <IconButton onClick={handleSubmit(onSubmitUpdateUserForm)}>
                        <Done color="primary" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        defaultValue={name}
                        error={!!errors.name}
                        helperText={errors.name ? errors.name.message : ''}
                        label="Name"
                        name="name"
                        inputRef={register}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        defaultValue={email}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ''}
                        label="Email"
                        name="email"
                        inputRef={register}
                      />
                    </TableCell>
                  </> :
                  <>
                    <TableCell component={"th"} scope="row" align="left">
                      <IconButton onClick={() => setUpdatedId(id)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={handleDeleteUser.bind(this, id)}>
                        <Delete color="primary" />
                      </IconButton>
                    </TableCell>
                    <TableCell scope="row">{id}</TableCell>
                    <TableCell align="center">{name}</TableCell>
                    <TableCell align="center">{email}</TableCell>
                  </>
                }
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[3, 5, 250, { label: 'All', value: -1 }]}
                colSpan={4}
                count={data.users.length}
                rowsPerPage={limit}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleClickOpen}>
        <Add />
      </Fab>
      <CreateUserDialog open={open} onClose={handleClose} limit={limit} skip={limit*page} />
    </Card>
  );
};

export default UserList;


