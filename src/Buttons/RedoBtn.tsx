import Button from "@mui/material/Button";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

export default function RedoBtn(props: {handleClick: () => void}){
  return (
    <Button variant="contained" endIcon={<ChevronLeftIcon />} onClick={props.handleClick} sx={{ m: 4 }}>
      Redo
    </Button>
  )
}