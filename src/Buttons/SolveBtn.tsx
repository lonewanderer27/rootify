import Button from "@mui/material/Button";
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

export default function SolveBtn(props: {handleClick: () => void}){
  return (
    <Button variant="contained" endIcon={<ChevronRightIcon />} onClick={props.handleClick} sx={{ m: 4 }}>
      Solve
    </Button>
  )
}