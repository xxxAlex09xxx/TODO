import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { toggleTheme } from "@/entities/theme/model/slice";
import style from './ThemeToggle.module.scss'

import moonIcon from '@/assets/moonIcon.png';
import sunIcon from '@/assets/sunIcon.png';

export const ThemeToggle = () =>{
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state)=> state.theme.theme);

    return (
        <button
        className={style.toggleButton}
        onClick={()=> dispatch(toggleTheme())}
        title='Переключить тему'
        >    
            <img 
    src={theme === 'light' ? moonIcon : sunIcon} 
    alt="Переключить тему" 
    className={style.icon} 
/>
        </button>
    )
}