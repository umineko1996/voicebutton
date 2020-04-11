package main

import (
	"bytes"
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
)

type (
	Track struct {
		Title  string   `json:"title"`
		Path   string   `json:"path"`
		Tags   []string `json:"tags"`
		Source string   `json:"source"`
	}

	// CAUTION: jsが扱うデータ形式と違う
	ArchiveInfo struct {
		Youtube []*YoutubeInfo `json:"YT"`
	}

	YoutubeInfo struct {
		Title string `json:"title"`
		Url   string `json:"url"`
		Date  string `json:"date"`
	}

	Contents struct {
		Root    string      `json:"soundRoot"`
		Archive ArchiveInfo `json:"archiveInfo"`
		Tracks  []*Track    `json:"tracks"`
	}
)

const (
	rootDir = "voices/"
	outJson = "target/contents.json"
)

func main() {
	if err := run(); err != nil {
		log.Println(err.Error())
		os.Exit(1)
	}
	os.Exit(0)
}

func run() error {
	trackFilePaths, err := getTrackJsonFilePaths()
	if err != nil {
		return err
	}

	tracks := []*Track{}
	for _, filepath := range trackFilePaths {
		track, err := readTrackJsonData(filepath)
		if err != nil {
			return err
		}
		tracks = append(tracks, track)
	}

	// 出力jsonデータ
	contents := Contents{
		Root:    rootDir,
		Archive: ArchiveInfo{},
		Tracks:  tracks,
	}

	buf, err := json.Marshal(contents)
	if err != nil {
		return err
	}

	jsonData := bytes.NewBuffer([]byte{})
	json.Indent(jsonData, buf, "", "  ")

	f, err := os.Create(outJson)
	if err != nil {
		return err
	}
	defer f.Close()
	if _, err := io.Copy(f, jsonData); err != nil {
		return err
	}
	return nil
}

// カレントディレクトリの voices 以下のjsonファイル一覧を返却する
func getTrackJsonFilePaths() ([]string, error) {
	cd, err := os.Getwd()
	if err != nil {
		return nil, err
	}
	return filepath.Glob(filepath.Join(cd, rootDir, "*.json"))
}

func readTrackJsonData(path string) (*Track, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	buf, err := ioutil.ReadAll(f)
	if err != nil {
		return nil, err
	}

	track := new(Track)
	if err := json.Unmarshal(buf, track); err != nil {
		return nil, err
	}

	return track, nil
}
