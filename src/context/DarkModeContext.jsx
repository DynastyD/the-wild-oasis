import { createContext, useContext, useEffect } from "react";
import {useLocalStorageState} from "../hooks/useLocalStorageState"

const DarkModeContext = createContext();

function DarkModeProvider ({children}){
    // 安全地检查window对象是否存在，避免SSR期间的警告
    const prefersDarkMode = () => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    };

    // 延迟调用prefersDarkMode，避免在初始渲染时执行
    const [isDarkMode, setIsDarkMode] = useLocalStorageState(
        typeof window !== 'undefined' ? prefersDarkMode() : false, 
        'isDarkMode'
    );useEffect(function(){
        if (typeof document === 'undefined') return;
        
        if(isDarkMode){
            document.documentElement.classList.add('dark-mode')
            document.documentElement.classList.remove('light-mode')
        } else{
            document.documentElement.classList.add('light-mode')
            document.documentElement.classList.remove('dark-mode')
        }
    },[isDarkMode])

    function toggleDarkMode(){
        setIsDarkMode(isDark =>!isDark)
    }



    return <DarkModeContext.Provider value={{isDarkMode, toggleDarkMode}}>{children}</DarkModeContext.Provider>
    
}

// 为避免警告，将useDarkMode定义为一个标准的React Hook
function useDarkMode(){
    const context = useContext(DarkModeContext);
    
    if(context === undefined) {
        console.warn('useDarkMode was called outside of DarkModeProvider. Make sure your component is wrapped in DarkModeProvider.');
        // 返回一个默认值避免应用崩溃
        return { isDarkMode: false, toggleDarkMode: () => {} };
    }
    
    return context;
}
export {DarkModeProvider, useDarkMode};