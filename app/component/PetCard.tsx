import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { IconProps } from '@expo/vector-icons/build/createIconSet';

interface PetCardProps {
    pet: {
        _id: string;
        age: number;
        type: string;
        breed: string;
        weight: number;
        height: number;
        color: string;
        gender: string;
        temperature: number;
        heartbeat: number;
        accelerometer: number;
        name?: string;
        petImage?: string;
    };
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
    const { width } = useWindowDimensions();

    const genderIconName = 
        pet.gender.toLowerCase() === 'male' ? 'gender-male' :
        pet.gender.toLowerCase() === 'female' ? 'gender-female' :
        'gender-non-binary';

    return (
        <View style={[styles.container, { width: width * 0.85 }]}>
            <MaterialCommunityIcons
                name="paw"
                size={80}
                color="rgba(0,0,0,0.1)"
                style={[styles.topPaw, { transform: [{ rotate: '240deg' }] }]}
            />

            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: pet.petImage || 'https://via.placeholder.com/270' }}
                    style={styles.image}
                />
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.leftSection}>
                    <Text style={styles.breedText}>{pet.breed}</Text>
                    <Text style={styles.nameText}>{pet.name || 'Sheru'}</Text>
                </View>

                <View style={styles.rightSection}>
                    <MaterialCommunityIcons 
                        name={genderIconName as IconProps<'gender-male' | 'gender-female' | 'gender-non-binary'>["name"]}
                        size={30}
                        color="gray"
                        style={styles.genderIcon}
                    />
                    <Text style={styles.ageText}>{pet.age} Years Old</Text>
                    <Text style={styles.syncText}>Last Synced - 00:00 am</Text>
                </View>
            </View>

            <MaterialCommunityIcons
                name="paw"
                size={80}
                color="rgba(0,0,0,0.1)"
                style={[styles.bottomPaw, { transform: [{ rotate: '40deg' }] }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#B5A8D5',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    imageContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    image: {
        width: 270,
        height: 270,
        borderRadius: 20,
    },
    detailsContainer: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    leftSection: {
        alignItems: 'flex-start',
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    breedText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    nameText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 22,
        color: 'black',
    },
    genderIcon: {
        borderRadius: 50,
        padding: 5,
        backgroundColor: 'white',
        marginBottom: 8,
    },
    ageText: {
        fontSize: 14,
        marginBottom: 4,
    },
    syncText: {
        fontSize: 12,
        color: 'gray',
    },
    topPaw: {
        zIndex: 1,
        position: 'absolute',
        top: 5,
        right: 10,
    },
    bottomPaw: {
        position: 'absolute',
        bottom: 10,
        left: 10,
    },
});

export default PetCard;
