import React, {  } from "react";
import {
  Backimgdiv,
  Backopacitydiv,
  Adpostdiv,
  Adpostbuttondiv,
} from "../../styles/layoutpage/contentpagestyle";
import BackgroundImg from "../../assets/images/core-images/background.png";
import Mainadimage from "../Content/Mainadimage";
import { Grid, Button, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const featuredProducts = [
  {
    name: "Condominiums",
    image: "",
    price: "1400",    
  },
  {
    name: "Condominiums",
    image: "",
    price: "1400",    
  },
  {
    name: "Condominiums",
    image: "",
    price: "1400",    
  },
  {
    name: "Condominiums",
    image: "",
    price: "1400",    
  },
  {
    name: "Condominiums",
    image: "",
    price: "1400",    
  },
  {
    name: "Condominiums",
    image: "",
    price: "1400",    
  },
]

const Content = () => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <div>
      <Backimgdiv>
        <img src={BackgroundImg} className="position-absolute w-100 h-100" style={{
          objectFit: 'cover'
        }} alt="Background" />
        <Backopacitydiv></Backopacitydiv>
        <Adpostdiv>
          <Adpostbuttondiv className="text-center text-md-start px-md-3">
            <Typography className="text-white pt-4" >{t('want_to_make_money')}</Typography>
            <Typography variant="h4" className="text-white mb-4">{t('Buy. Chat. Sell')}</Typography>
            <Button variant="contained" color="primary" size="large" onClick={() => {
              history.push('/ad')
            }}>
              <i className="fa fa-plus"></i>&nbsp;&nbsp;&nbsp;{t('POST AD FOR FREE')}                
            </Button>
          </Adpostbuttondiv>

          <Grid container spacing={3} className="py-4 px-4 justify-content-center" style={{
            maxWidth: 750
          }}>
            {
              featuredProducts.map((fp, index) => <Grid key={"featured-product-" + index} item xs={12} sm={6} md={6} lg={4} >
                <Mainadimage 
                  price={fp.price}
                  name={t(fp.name)}                  
                />
              </Grid>)
            }
          </Grid>
        </Adpostdiv>
      </Backimgdiv>
    </div>
  )
}

export default Content;
