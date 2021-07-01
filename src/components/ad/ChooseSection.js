import { FormControl, Select, Grid, FormHelperText } from "@material-ui/core";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSubCategories, getSubCategory } from "../../store/actions/subCategoryActions";
import AdSectionPaper from "../common/AdSectionPaper";


const ChooseSection = ({ data, setData }) => {
    const dispatch = useDispatch(null);
    const { categories } = useSelector(state => state.category);
    const { subCategories } = useSelector(state => state.subCategory);
    const errors = useSelector(state => state.errors);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    useEffect(() => {
        if (selectedCategory) {
            setData({
                ...data,
                category: selectedCategory
            });
            dispatch(getSubCategories(selectedCategory));
        }
    }, [selectedCategory])
    useEffect(() => {
        if (selectedSubCategory) {
            setData({
                ...data,
                subCategory: selectedSubCategory
            });
            dispatch(getSubCategory(selectedSubCategory));
        }
    }, [selectedSubCategory])

    return <AdSectionPaper 
        title="Choose Section"
    >
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl 
                    fullWidth
                    error={!!errors.category}
                >
                    <Select native variant="outlined" value={selectedCategory} onChange={ev => setSelectedCategory(ev.target.value)} required>
                        <option value="">Choose Category</option>
                        {
                            categories?.map((cat, index) => <option key={"category-item-" + index} value={cat._id}>{cat.name}</option>)
                        }
                    </Select>
                    <FormHelperText>{errors.category}</FormHelperText>
                </FormControl>                
            </Grid>    
            <Grid item xs={12} sm={6}>
                {
                    subCategories.length > 0 && <FormControl fullWidth error={!!errors.subCategory}>
                        <Select native variant="outlined" value={selectedSubCategory} onChange={ev => setSelectedSubCategory(ev.target.value)} required>
                            <option value="">Choose Sub Category</option>
                            {
                                subCategories.map((category, index) => <option key={"sub-category-item-" + index} value={category._id}>{category.name}</option>)
                            }
                        </Select>
                        <FormHelperText>{errors.subCategory}</FormHelperText>
                    </FormControl>
                }                    
            </Grid>   
        </Grid>
    </AdSectionPaper>
}

export default ChooseSection;