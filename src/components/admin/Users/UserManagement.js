import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUsers, registerUser, updateUser } from "../../../store/actions/authActions";
import AvatarUpload from "../../common/avatar/AvatarUpload";
import BadgeAvatar from "../../common/BadgeAvatar";
import { 
    Grid, Table, TableHead, TableBody, TableContainer, TableRow, TableCell, Paper, IconButton, Fab, 
    Button, Dialog, DialogContent, DialogTitle, TextField, useTheme, useMediaQuery, 
    Select
} from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Close as CloseIcon, RemoveRedEye as ViewIcon } from "@material-ui/icons";
import { useForm } from "react-hook-form";
import { CLEAR_ERRORS } from "../../../store/actions/types";
import { roles } from "../../../utils/roles";
import { useHistory } from "react-router-dom";

const columns = [
    {
        field: 'name',
        title: "Name",
    },
    {
        field: 'avatar',
        title: "Avatar",
        render: (src, gender) => {
            return <BadgeAvatar src={src} gender={gender} size="small" showBadge={false} />
        },
    },
    {
        field: 'email',
        title: "Email"
    },
    {
        field: 'gender',
        title: "Gender",
        render: value => value
    },
    {
        field: 'role',
        title: "Role"
    }
]

const UserManagement = () => {
    const { users } = useSelector(state => state.auth);
    const errors = useSelector(state => state.errors);
    const dispatch = useDispatch(null);
    const [open, setOpen] = useState(false);
    const [adding, setAdding] = useState(false)
    const { handleSubmit } = useForm();
    const initialData = {
        name: "",
        email: "",
        password: "",
        password2: "",
        avatar: "",
        gender: "male", 
        role: roles.client
    }
    const [data, setData] = useState(initialData);
    const theme = useTheme();
    const isWidthDownSm = useMediaQuery(theme.breakpoints.down('sm'));
    const history = useHistory();
    
    useEffect(() => {
        dispatch(getUsers());
    }, [])
    useEffect(() => {
        setOpen(false);
        setData(initialData);
    }, [users])
    useEffect(() => {
        dispatch({
            type: CLEAR_ERRORS
        })
    }, [open])

    const handleSave = () => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('password2', data.password2);
        formData.append('avatar', data.avatar);
        formData.append('gender', data.gender);
        
        if (adding) dispatch(registerUser(formData))
        else dispatch(updateUser(data.id, formData));
    }
    const handleAdd = () => {
        setData(initialData);
        setAdding(true);
        setOpen(true);
    }
    const handleEdit = (user) => {
        setData({
            ...data,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            gender: user.gender,
            id: user._id
        });
        setAdding(false);
        setOpen(true);
    }


    return <Grid container spacing={1} className="h-100">
        <Grid item xs={12} className="h-100">
            <TableContainer component={Paper} elevation={0} square variant="outlined" className="h-100">
                
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {
                                columns.map((col, index) => <TableCell key={"usertable-header-item" + index}>
                                    {
                                        col.title
                                    }
                                </TableCell>)
                            }   
                            <TableCell>         
                                <div className="d-flex justify-content-end">
                                    <Fab color="default" aria-label="" size="medium" 
                                        style={{
                                            marginBottom: '-45px'
                                        }}
                                        onClick={handleAdd}
                                    >
                                        <AddIcon />
                                    </Fab>                   
                                </div>
                            </TableCell>     
                        </TableRow>     
                    </TableHead>
                    <TableBody>
                        {
                            users.map((user, u_i) => <TableRow key={"usertable-body-row-" + u_i}>
                                {
                                    columns.map((col, c_i) => <TableCell key={"usertabel-body-col-" + c_i}>
                                        {
                                            col.render ? (
                                                col.field === "avatar" ? col.render(user[col.field], user.gender) : col.render(user[col.field])
                                            ) : user[col.field]
                                        }
                                    </TableCell>)
                                }
                                <TableCell>
                                    <div className="d-flex justify-content-end">
                                        <IconButton aria-label="" onClick={() => history.push('/u/' + user._id)} size="small">
                                            <ViewIcon />
                                        </IconButton>   
                                        <IconButton aria-label="" onClick={() => handleEdit(user)} size="small">
                                            <EditIcon />
                                        </IconButton>        
                                        <IconButton aria-label="" onClick={() => {
                                            dispatch(deleteUser(user._id));
                                        }} size="small">
                                            <DeleteIcon />
                                        </IconButton>     
                                    </div>                  
                                </TableCell>
                            </TableRow>)
                        }                        
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>   
        <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="" fullWidth fullScreen={isWidthDownSm}>
          <DialogTitle>
            {
                adding ? "Add new user" : "Edit " + data.name
            }
            <IconButton aria-label="" onClick={() => setOpen(false)} className=" float-end">
                <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className="py-3">
            <form onSubmit={handleSubmit(handleSave)}>
                <AvatarUpload 
                    defaultSrc={data.avatar}
                    defaultGender={data.gender}
                    className="mb-3" 
                    onChange={avatar => setData({...data, avatar: avatar})}
                    onChangeGender={gender => setData({...data, gender})}
                />  
                <TextField            
                    label="Name"
                    variant="outlined"
                    fullWidth
                    className="mb-3"
                    value={data.name}
                    onChange={ev => setData({...data, name: ev.target.value})}
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                />    
                <TextField                
                    label="Email"
                    variant="outlined"
                    fullWidth
                    className="mb-3"
                    type="email"
                    value={data.email}
                    onChange={ev => setData({...data, email: ev.target.value})}
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                />  
                <TextField              
                    label="Password"
                    variant="outlined"
                    fullWidth
                    className="mb-3"
                    type="password"
                    value={data.password}
                    onChange={ev => setData({...data, password: ev.target.value})}
                    required={adding}
                    error={!!errors.password}
                    helperText={errors.password}
                /> 
                <TextField               
                    label="Password Confirmation"
                    variant="outlined"
                    fullWidth
                    className="mb-3"
                    type="password"
                    value={data.password2}
                    onChange={ev => setData({...data, password2: ev.target.value})}
                    required={adding}
                    error={!!errors.password2}
                    helperText={errors.password2}
                />     
                <Select native fullWidth className="mb-3" variant="outlined" value={data.role} onChange={ev => setData({...data, role: ev.target.value})}>
                    {
                        Object.keys(roles).map((role, index) => <option key={"role-item-" + index} value={roles[role]}>{roles[role]}</option>)
                    }
                </Select>          
                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Save                  
                </Button>
            </form>
          </DialogContent>
        </Dialog>   
    </Grid>
}
export default UserManagement;