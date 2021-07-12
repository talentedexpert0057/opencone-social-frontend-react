import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ColorButton from '../../components/common/button/ColorButton';
import ImageContent from '../../components/Product/ImageContent';
import { WhatsApp, Sms, Phone, ArrowBackIos, ArrowForwardIos, Home } from "@material-ui/icons";
import DetailedProfile from '../../components/Product/DetailedProfile';
import ShortProfile from '../../components/Product/ShortProfile';
import AddressInformation from '../../components/Product/AddressInformation';
import AllShopAds from '../../components/Product/AllShopAds';
import Popular from '../../components/Product/Popular';
import Comments from '../../components/Product/Comments';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getAd, getAds } from '../../store/actions/adActions';
import ProgressCircle from '../../components/common/progress/ProgressCircle';
import NotFound from '../../components/errors/NotFound';
import moment from 'moment';
import { AD_INIT } from '../../store/actions/types';
import { shuffleArray } from '../../utils/functions';
import { addContact } from '../../store/actions/chatActions';

const useStyles = makeStyles(theme => ({
    detailedDiv: {
        [theme.breakpoints.down('sm')]: {
            order: '2'
        }
    },
    shortDiv: {
        [theme.breakpoints.down('sm')]: {
            order: '1'
        }
    }
}))

const AdDetailsPage = () => {
    const classes = useStyles();
    const history = useHistory();
    const [currentId, setCurrentId] = useState(history.location.pathname.replace('/ads/', '').trim());
    const dispatch = useDispatch(null);
    const errors = useSelector(state => state.errors);
    const { ad, ads: originalAds, loading } = useSelector(state => state.ad);
    const auth = useSelector(state => state.auth);
    const { contacts } = useSelector(state => state.chat);
    const [ads, setAds] = useState([]);
    const { isMobile } = useSelector(store => store.device);
    const currentIndex = ads.findIndex(dd => dd._id === currentId);
    const previousId = currentIndex > 0 ? ads[currentIndex - 1]._id : false;
    const nextId = currentIndex < ads.length - 1 ? ads[currentIndex + 1]._id : false;
    const dateFrom = moment(ad.user?.date);
    const headerTitle = {
        title: ad.title,
        icon: <Home />,
        directories: [
            "Home"
        ]
    }
    
    useEffect(() => {
        dispatch({
            type: AD_INIT
        })
    }, []);

    useEffect(() => {
        dispatch(getAds());
        dispatch(getAd(currentId));
    }, [currentId]);

    useEffect(() => {
        setAds(shuffleArray(originalAds).filter(ad => ad.is_blocked != 1));
    }, [originalAds]);

    let dirCity = ""
    if (ad.subCity) {
        dirCity = ad.subCity?.city.name + " - " + ad.subCity?.name;
    }
    if (dirCity) {
        headerTitle.directories.push(dirCity);
    }
    if (ad.sub_category) {
        headerTitle.directories.push(ad.sub_category?.category?.name);
        headerTitle.directories.push(ad.sub_category?.name);
    }

    const productData = {
        images: ad.images || [],
        specs: [
            {
                title: "City",
                value: ad.city?.name || ad.subCity?.city.name
            },
            {
                title: "Neighborhood",
                value: ad.subCity?.name
            },
        ],
        adList: [
            {
                title: "Condominiums",
                img: "/img/mainadimg.png",
                avatar: "/img/mainadimg.png",
                status: "Rent",
                price: 1400
            },
            {
                title: "Condominiums",
                img: "/img/mainadimg.png",
                avatar: "/img/mainadimg.png",
                status: "Rent",
                price: 1400
            },
            {
                title: "Condominiums",
                img: "/img/mainadimg.png",
                avatar: "/img/mainadimg.png",
                status: "Rent",
                price: 1400
            },
            {
                title: "Condominiums",
                img: "/img/mainadimg.png",
                avatar: "/img/mainadimg.png",
                status: "Rent",
                price: 1400
            },
            {
                title: "Condominiums",
                img: "/img/mainadimg.png",
                avatar: "/img/mainadimg.png",
                status: "Rent",
                price: 1400
            },
        ],
        popularList: [
            "3 Bedrooms For Sale in Jubaiha",
            "3 Bedrooms For Sale in Khalda",
            "3 Bedrooms For Sale in Tabarboor",
            "3 Bedrooms For Sale in Daheit Al Rasheed",
            "3 Bedrooms For Sale in Marj El Hamam"
        ],
        shortProfile: {
            avatar: ad.user?.avatar,
            gender: ad.user?.gender,
            name: ad.user?.name,
            dateFrom: dateFrom.format('MM-DD-yyyy'),
            reviews: 0,
            phoneNumber: "07969451813",
            generalTips: [
                "Only meet in public places.",
                "Never pay or transfer money in advance.",
                "Inspect the product before you buy it."
            ]
        }
    }

    productData.specs = [
        ...productData.specs,
        ...ad.fieldData || []
    ];
    
    if (errors.adnotfound) {
        return <NotFound text="404" />
    }

    const handleClickChatButton = ev => {
        if (!contacts.find(contact => contact.receiver._id === ad.user._id) && ad.user._id !== auth.user.id) {
            dispatch(addContact(ad.user._id, history));
        } else {
            history.push('/chat');
        }
    }

    return (
        Object.values(ad).length > 0 ? <div>
        <Grid container spacing={1} alignItems="center" className="py-3 mt-2">
            <Grid item>
                {headerTitle.icon}
            </Grid>
            {
                headerTitle.directories.map((directory, index) => <Grid key={'directory-item' + index} item>
                    <Typography variant="caption" >
                        {directory}
                        &nbsp; <ArrowForwardIos style={{ fontSize: 12 }} />
                    </Typography>
                </Grid>)
            }
            <Grid item>
                <Typography variant="subtitle2" >
                    {headerTitle.title}
                </Typography>
            </Grid>
        </Grid>            
        {
            !loading ? <ImageContent 
                main={productData.images[0]}
                images={productData.images}
            /> : <ProgressCircle />
        }
        <Grid container justify="space-between" alignItems="center" className="py-4">
            <Grid item xs={2}>
                <Button 
                    variant="text" 
                    color="primary" 
                    className="text-capitalize" 
                    fontSize="small" 
                    size="small" 
                    disabled={!previousId} 
                    onClick={() => {
                        history.push("/ads/" + previousId);
                        setCurrentId(previousId);
                    }}
                >
                    <ArrowBackIos fontSize="small" />
                    {!isMobile && "Previous Ad"}
                </Button> 
            </Grid>
            <Grid item xs={6}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <ColorButton color="success" className="" disabled={ad.user._id === auth.user.id} >
                            <WhatsApp fontSize="small" /> &nbsp;
                            WhatsApp
                        </ColorButton>
                    </Grid>    
                    <Grid item xs={12} md={4}>
                        <Button variant="contained" color="primary" className="text-capitalize" fullWidth disabled={ad.user._id === auth.user.id} onClick={handleClickChatButton} >
                            <Sms fontSize="small" /> &nbsp;
                            Chat
                        </Button>
                    </Grid>       
                    <Grid item xs={12} md={4}>
                        <ColorButton color="danger" className="" outlined disabled={ad.user._id === auth.user.id}>
                            <Phone fontSize="small" /> &nbsp;
                            079694XXXX
                        </ColorButton>
                    </Grid>       
                </Grid>
            </Grid>
            <Grid item xs={2} className="d-flex justify-content-end">
                <Button 
                    variant="text" 
                    color="primary" 
                    className="text-capitalize" 
                    fontSize="small" 
                    size="small"
                    disabled={!nextId}
                    onClick={() => {
                        history.push("/ads/" + nextId);
                        setCurrentId(nextId);
                    }}
                >
                    {!isMobile && "Next Ad"}
                    &nbsp;
                    <ArrowForwardIos fontSize="small" />
                </Button> 
            </Grid>
        </Grid>
        <Grid container spacing={2}>
            <Grid item md={9} className={classes.detailedDiv}>
                <Grid container spacing={2} >
                    <Grid item md={7}>
                        <DetailedProfile 
                            title={ad.title}
                            description={ad.description}
                            postId={ad._id}
                        />
                    </Grid>           
                    <Grid item md={5}>
                        <AddressInformation data={productData.specs} /> 
                    </Grid>
                    <Grid item md={11} lg={10} xl={9}>
                        <AllShopAds data={productData.adList} />
                    </Grid>    
                    <Grid item md={11} lg={10} xl={9}>
                        <Popular data={productData.popularList} />
                    </Grid>      
                    <Grid item md={11} lg={10} xl={9}>
                        <Comments adId={currentId} data={ad.comments || []} />
                    </Grid>   
                </Grid>
            </Grid>
            <Grid item md={3} className={classes.shortDiv}>
                <ShortProfile 
                    id={ad.user?._id}
                    name={productData.shortProfile.name}
                    avatar={productData.shortProfile.avatar}
                    dateFrom={productData.shortProfile.dateFrom}
                    reviews={productData.shortProfile.reviews}
                    phoneNumber={productData.shortProfile.phoneNumber}
                    generalTips={productData.shortProfile.generalTips}
                    gender={productData.shortProfile.gender}
                />
            </Grid>
        </Grid>
    </div> : 
    <ProgressCircle />
    )
}

export default AdDetailsPage;