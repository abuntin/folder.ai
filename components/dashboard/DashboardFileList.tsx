'use client' 


import * as React from 'react' 
import { Unstable_Grid2 as Grid, IconButton } from "@mui/material";
import { InsertDriveFileSharp, FolderSharp } from '@mui/icons-material'
import { useDashboard } from '.'
import { DText } from 'components';
import { Folder } from 'lib/models';

interface DashboardFileListProps {
    
} 

export const DashboardFileList: React.FC<DashboardFileListProps> = (props) => {

    const { current, root, kernel } = useDashboard()

    const folders = React.useMemo(() => {

        const folder = current;

        if (!folder || !folder.children.length) return [] as Folder[]

        return folder.children

    }, [current])
 
    return (
       <Grid container spacing={4}> 
            {
                folders.map((folder: Folder, i) => {
                    return (
                        <Grid xs={3} key={i} display='flex' flexDirection='column'>
                            <IconButton onDoubleClick={e => kernel.load(folder.path)}>
                                {folder.isDirectory ? <FolderSharp sx={{ transform: `scale(4)` }} /> : <InsertDriveFileSharp sx={{ transform: `scale(4)` }} />}
                            </IconButton>
                            <DText text={folder.name} variant='body2' />
                        </Grid>
                    )
                })
            }
       </Grid>
    )
}