#include <iostream>
#include <cmath>
#include <fstream>

using namespace std;

const int sampleRate = 44100;
const int bitDepth = 16;

class SineOscillator {
    float frequency, amplitude, angle = 0.0f, offset = 0.0f;
    // A*Sin(2pif/sr)
    public:
        SineOscillator(float freq, float amp): frequency(freq), amplitude(amp) {
            offset =  2 * M_PI * freq / sampleRate;
        }
        float process(){
            float sample = amplitude * sin(angle);
            angle += offset;

            return sample;
        }
};

void writeToFile(ofstream &file, int val, int size){
    file.write(reinterpret_cast<char*> (&val), size);
}

int main(int argc, char const *argv[])
{
    int duration = 2;
    ofstream audioFile;
    audioFile.open("waveform.wav", ios::binary);
    SineOscillator sine(880, 0.5);

    //header chunk
    audioFile << "RIFF";
    audioFile << "----";
    audioFile << "WAVE";


    //formatt chunk
    audioFile << "fmt ";
    writeToFile(audioFile, 16, 4); // Size
    writeToFile(audioFile, 1, 2); // Compression code
    writeToFile(audioFile, 1, 2); // Number of channels
    writeToFile(audioFile, sampleRate, 4); // Sample rate
    writeToFile(audioFile, sampleRate * bitDepth / 8, 4 ); // Byte rate
    writeToFile(audioFile, bitDepth / 8, 2); // Block align
    writeToFile(audioFile, bitDepth, 2); // Bit depth


    //data chunk
    audioFile << "data";
    audioFile << "----";

    int prePosition = audioFile.tellp();

    auto maxAmp = pow(2, bitDepth-1) - 1;
    for (int i = 0; i < sampleRate*duration; i++){
        auto sample = sine.process();
        int intSample = static_cast<int> (sample*maxAmp);
        writeToFile(audioFile, intSample, 2);
    }

    int postPosition = audioFile.tellp();

    // write data size
    audioFile.seekp(prePosition - 4);
    writeToFile(audioFile, postPosition - prePosition, 4);

    // write file chunk size
    audioFile.seekp(4, ios::beg);
    writeToFile(audioFile, postPosition - 8, 4);

    audioFile.close();
        
    return 0;
}

