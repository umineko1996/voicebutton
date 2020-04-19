package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"
)

type Track struct {
	Title  string   `json:"title"`
	Path   string   `json:"path"`
	Tags   []string `json:"tags"`
	Source string   `json:"source"`
}

func main() {
	wait := func() {
		fmt.Print("Press 'Enter' to continue...")
		bufio.NewReader(os.Stdin).ReadBytes('\n')
	}

	if err := run(os.Args); err != nil {
		log.Println(err.Error())
		wait()
		os.Exit(1)
	}
	wait()
	os.Exit(0)
}

var errUsage = errors.New("usage: voicejson.exe voice.mp3(m4a).")

func run(args []string) error {
	if len(args) == 1 {
		return errUsage
	}

	targetDir, voiceBase, voiceName, voiceExt := parsePath(args[1])
	switch voiceExt {
	case ".mp3", ".mp4":
	default:
		return errUsage
	}

	// 出力場所の計算
	outJSON := filepath.Join(targetDir, voiceName+".json")
	if _, err := os.Stat(outJSON); err == nil {
		// TODO( ) ファイル上書き確認
		fmt.Println(voiceName + ".json is exist so overwrite.")
	} else if !os.IsNotExist(err) {
		return err
	}

	// 必要なデータの入力
	fmt.Println("Please input.")
	fmt.Print("voice tags >")
	tmp, err := inputLine()
	if err != nil {
		return err
	}
	voiceTags := strings.Split(tmp, " ")

	fmt.Println("voice source >")
	voiceSource, err := inputLine()
	if err != nil {
		return err
	}

	track := Track{
		Title:  voiceName,
		Path:   voiceBase,
		Tags:   voiceTags,
		Source: voiceSource,
	}

	// json へのエンコード
	buf, err := json.Marshal(track)
	if err != nil {
		return err
	}

	jsonData := bytes.NewBuffer([]byte{})
	json.Indent(jsonData, buf, "", "  ")

	fmt.Println("create JSON.")
	fmt.Println(jsonData.String())

	// json ファイルの書き出し
	f, err := os.Create(outJSON)
	if err != nil {
		return err
	}
	defer f.Close()
	if _, err := io.Copy(f, jsonData); err != nil {
		return err
	}

	return nil
}

func parsePath(path string) (dir, base, name, ext string) {
	dir = filepath.Dir(path)
	base = filepath.Base(path)
	ext = filepath.Ext(base)
	name = base[:len(base)-len(ext)]
	return dir, base, name, ext
}

func inputLine() (string, error) {
	buf, err := bufio.NewReader(os.Stdin).ReadBytes('\n')
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(string(buf)), nil
}
