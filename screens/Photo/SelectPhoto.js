import React, { useState, useEffect } from "react";
import { Image, ScrollView } from "react-native";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import styled from "styled-components";
import Loader from "../../components/Loader";
import constants from "../../constants";

const View = styled.View`
    flex: 1;
`;

const Text = styled.Text``;

export default () => {
    const [loading, setLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);
    const [selected, setSelected] = useState();
    const [allPhotos, setAllPhotos] = useState();
    const getPhotos = async () => {
        try {
            const { assets } = await MediaLibrary.getAssetsAsync();
            const [firstPhoto] = assets;
            setSelected(firstPhoto);
            console.log(firstPhoto);
            setAllPhotos(assets);
            console.log(selected);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }
    const askPermission = async () => {
        try {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            console.log(status);
            if (status === "granted") {
                setHasPermission(true);
                console.log(hasPermission);
                getPhotos();
            }
        } catch (e) {
            console.log(e);
            setHasPermission(false);
        }
    }
    useEffect(() => {
        askPermission();
    }, []);

    return (
        <View>
            {/* {hasPermission ? (
                <>
                    <Image
                        style={{ width: constants.width, height: constants.height / 2 }}
                        source={{ uri: selected.uri }} 
                    />
                    <ScrollView>
                        {allPhotos.map(photo => <Image key={photo.id} source={{uri: photo.uri}} style={{width: constants.width / 3, height: constants.height / 4}} />)}
                    </ScrollView>
                </>
            ) : null} */}
        </View>
    );
};